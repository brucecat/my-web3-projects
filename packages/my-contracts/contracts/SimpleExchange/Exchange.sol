// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import './Qtum.sol';

enum OrderStateEnum{
  Create, // 0 创建
  Cancel, // 1 取消
  Fill // 2 完成
}

// 订单结构体
struct _Order {
  uint256 id;
  address user;
  address tokenGet;
  uint256 amountGet;

  address tokenGive;
  uint256 amountGive;

  uint256 timestamp;
  OrderStateEnum orderState;
}

contract Exchange {
  using SafeMath for uint256;

  // 收费账户地址
  address public feeAccount;
  uint256 public feePercent;

  address constant ETHER_ADDRESS = address(0);
  mapping(address => mapping(address => uint256)) public tokens;

  // _Order[] orderList;
  mapping(uint256 => _Order) public orders;
  uint256 public orderCount = 0;

  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);
  event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
  event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
  event Fill(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);

  constructor(address account, uint256 percent) {
    feeAccount = account;
    feePercent = percent;
  }

  // 存以太币
  function depositEther() payable public {
    // msg.sender
    // msg.value
    tokens[ETHER_ADDRESS][msg.sender] = tokens[ETHER_ADDRESS][msg.sender].add(msg.value);
    emit Deposit(ETHER_ADDRESS, msg.sender, msg.value, tokens[ETHER_ADDRESS][msg.sender]);

  }

  // 存其他货币
  function depositToken(address _token, uint256 _amount) public {
    require(_token != address(0));

    // 调用方法从msg.sender转入合约(交易所账户)地址
    Qtum(_token).transferFrom(msg.sender, address(this), _amount);

    // 交易所进行记录
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

 //提取以太币
  function withdrawEther(uint256 _amount) public{
    require(tokens[ETHER_ADDRESS][msg.sender] >= _amount);
    tokens[ETHER_ADDRESS][msg.sender] = tokens[ETHER_ADDRESS][msg.sender].sub(_amount);

    //payable
    payable(msg.sender).transfer(_amount);
    emit Withdraw(ETHER_ADDRESS,msg.sender,_amount ,tokens[ETHER_ADDRESS][msg.sender]);
  }

  // 提取token
  function withdrawToken(address _token, uint256 _amount) public {
    require(tokens[_token][msg.sender] >= _amount);
    require(_token != address(0));

    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);

    // 调用方法从合约(交易所账户)地址转入msg.sender
    require(Qtum(_token).transfer(msg.sender, _amount));
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  // 查询余额
  function balanceOf(address _token, address _user) public view returns(uint256) {
    return tokens[_token][_user];
  }

  // 创建订单
  function makeOrder(
    address _tokenGet,
    uint256 _amountGet,
    address _tokenGive,
    uint256 _amountGive) public {
      require(balanceOf(_tokenGive, msg.sender) >= _amountGive, unicode"余额不足");
      orderCount = orderCount.add(1);
      
      orders[orderCount] = _Order(
        orderCount,
        msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        block.timestamp,
        OrderStateEnum.Create
      );

      // 发出订单事件
      emit Order(orderCount,
        msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        block.timestamp
      );
  }
  // 取消订单
  function cancelOrder(uint256 _id) public {
    orders[_id].orderState = OrderStateEnum.Cancel;
    _Order memory o = orders[_id];
    emit Cancel(
      _id,
      msg.sender,
      o.tokenGet,
      o.amountGet,
      o.tokenGive,
      o.amountGive,
      block.timestamp
    );
  }
  // 完成订单
  function fillOrder(uint256 _id) public {
    _Order memory o = orders[_id];

    // 账户余额互换 小费收取
    /*
      xiaoming makeOrder
      amountGet: 100 QT  => amountGive: 1ETH

      xiaoming 多了100QT, 少了 1ETH
      msg.sender fillOrder
      msg.sender 多了1ETH，少了 100QT
    */
    uint256 feeAmount = o.amountGet.mul(feePercent).div(100);


    require(balanceOf(o.tokenGive,o.user)>=o.amountGive,unicode"创建订单的用户的余额不足");

    require(balanceOf(o.tokenGet,msg.sender)>=o.amountGet.add(feeAmount),unicode"填充订单的用户的余额不足");


    tokens[o.tokenGet][msg.sender] = tokens[o.tokenGet][msg.sender].sub(o.amountGet.add(feeAmount));
    tokens[o.tokenGet][o.user] = tokens[o.tokenGet][o.user].add(o.amountGet);

   // 小费
    tokens[o.tokenGet][feeAccount] = tokens[o.tokenGet][feeAccount].add(feeAmount);

    tokens[o.tokenGive][msg.sender] = tokens[o.tokenGive][msg.sender].add(o.amountGive);
    tokens[o.tokenGive][o.user] = tokens[o.tokenGive][o.user].sub(o.amountGive);

    orders[_id].orderState = OrderStateEnum.Fill;
    emit Fill(
      _id,
      o.user,
      o.tokenGet,
      o.amountGet,
      o.tokenGive,
      o.amountGive,
      block.timestamp
    );

  }

  // 获取order
  function getOrdersById(uint id) public view returns(_Order memory) {
    return orders[id];
  }

  // 将存储在映射中的订单转换为数组的辅助函数
  function mapToArray(mapping(uint256 => _Order) storage allOrders) internal view returns (_Order[] memory) {
    // id为0的是空order 长度需加1
    _Order[] memory orderArray = new _Order[](orderCount + 1);
    for (uint256 i = 0; i <= orderCount; i++) {
        orderArray[i] = allOrders[i];
    }
    return orderArray;
  }

  // 获取所有订单
  function getAllOrders() public view returns(_Order[] memory) {
    if (orderCount == 0) {
      _Order[] memory orderArray = new _Order[](orderCount);
      return  orderArray;
    }
    return mapToArray(orders);
  }
}
