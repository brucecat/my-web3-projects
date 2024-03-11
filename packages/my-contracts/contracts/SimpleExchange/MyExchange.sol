// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import './Qtum.sol';

// 订单状态枚举
enum OrderStateEnum{
  Create, // 0 创建
  Cancel, // 1 取消
  Fill // 2 完成
}

// 订单结构体
struct _Order{
  // 当前订单的id
  uint256 id;

  // 要换代币的用户地址
  address user;

  // 要获得代币的代币合约地址
  address tokenGet;

  // 获得的代币数
  uint256 amountGet;

  // 要付出的代币的代币合约地址
  address tokenGive;

  // 付出的代币数
  uint256 amountGive;

  // 时间戳
  uint256 timestamp;

  // 订单状态
  OrderStateEnum orderState;
}

contract MyExchange {
  using SafeMath for uint256;

  // 收费账户地址
  address public feeAccount;

  // 小费比例
  uint256 public feePercent;

  // 
  address constant ETHER_ADDRESS = address(0);

  // 代币账户映射表
  mapping(address => mapping(address => uint256)) public tokens;

  // 订单映射表
  mapping(uint256 => _Order) public orders;
  uint256 public orderCount = 0;

  // 事件
  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint256 amount, uint256 balance);
  event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
  event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
  event Fill(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);

  constructor(address account, uint256 percent) {
    // 初始化收费地址
    feeAccount = account;

    // 初始化收小费的比例
    feePercent = percent;
  }

  // 存以太币
  function depositEther() payable public {
    tokens[ETHER_ADDRESS][msg.sender] = tokens[ETHER_ADDRESS][msg.sender].add(msg.value);
    emit Deposit(ETHER_ADDRESS, msg.sender, msg.value, tokens[ETHER_ADDRESS][msg.sender]);

  }

  // 存其他代币
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

  // 查询对应货币的对应用户的余额
  function balanceOf(address _token, address _user) public view returns(uint256) {
    return tokens[_token][_user];
  }

  // -----------------------------------订单相关逻辑----------------------------------------
  // 创建订单
  // xiaoming makeOrder => msg.sender就是xiaoming
  function makeOrder(
    address _tokenGet,
    uint256 _amountGet,
    address _tokenGive,
    uint256 _amountGive) public {
      require(balanceOf(_tokenGive, msg.sender) >= _amountGive, unicode"余额不足");
      
      // 增加订单数
      orderCount = orderCount.add(1);

      // 创建订单
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

    _Order memory delOrder = orders[_id];
    
    require(delOrder.id == _id, unicode"数据有误");

    // 更改状态
    // orderCancel[_id] = true
    orders[_id].orderState = OrderStateEnum.Cancel;

    emit Cancel(
      _id,
      msg.sender,
      delOrder.tokenGet,
      delOrder.amountGet,
      delOrder.tokenGive,
      delOrder.amountGive,
      block.timestamp
    );
  }

  // 完成订单
  function fillOrder(uint256 _id) public {
    _Order memory o = orders[_id];

    // 账户余额 互换 && 小费收取
    /* 
      举例：xiaoming花费 1 ETH => 100 KWT 
      xiaoming, makeorder
      xiaoming,少了1ETH
      xiaoming，多了100KWT

      msg.sender: 接受交易的用户B
      msg.sender, fillOrder
      msg.sender, 多了1ETH
      msg.sender, 少了100KWT
    */
    uint256 feeAmount = o.amountGet.mul(feePercent).div(100);

    require(balanceOf(o.tokenGive,o.user)>=o.amountGive,unicode"创建订单的用户的余额不足");
    require(balanceOf(o.tokenGet,msg.sender)>=o.amountGet.add(feeAmount),unicode"填充订单的用户的余额不足");

    // 代币交换  
    // 第一步：合约holder => xiaoming 100 KWT
    // o.tokenGet: 代币合约地址
    // msg.sender: 用户B
    // 1.1 用户B: - 100KWT - 小费
    // 1.2 用户: + 100KWT
    tokens[o.tokenGet][msg.sender] = tokens[o.tokenGet][msg.sender].sub(o.amountGet.add(feeAmount));
    tokens[o.tokenGet][o.user] = tokens[o.tokenGet][o.user].add(o.amountGet);

    // 第二步：小费入账
    // 小费 单位：要获取的代币 这里是KWT
    // 2.1 feeAccount： + 1KWT
    tokens[o.tokenGet][feeAccount] = tokens[o.tokenGet][feeAccount].add(feeAmount);

    // 第三步：
    // o.tokenGive： ETH合约地址
    // msg.sender: 用户B
    // o.user: 发起订单的用户地址 xiaoming
    // 3.1 用户B: + 1 ETH
    // 3.2 用户: -1 ETH
    tokens[o.tokenGive][msg.sender] = tokens[o.tokenGive][msg.sender].add(o.amountGive);
    tokens[o.tokenGive][o.user] = tokens[o.tokenGive][o.user].sub(o.amountGive);
    
    // 完成订单
    orders[_id].orderState = OrderStateEnum.Fill;

    // 抛出事件
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

  // 获取小费比例
  function getFeePercent() public view returns(uint256) {
    return feePercent;
  }
}
