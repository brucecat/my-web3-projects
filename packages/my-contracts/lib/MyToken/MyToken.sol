// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Context.sol";

contract MyToken is Context {
    // function name() public view returns (string)
    // function symbol() public view returns (string)
    // function decimals() public view returns (uint8)
    // function totalSupply() public view returns (uint256)
    // function balanceOf(address _owner) public view returns (uint256 balance)
    // function transfer(address _to, uint256 _value) public returns (bool success)
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
    // function approve(address _spender, uint256 _value) public returns (bool success)
    // function allowance(address _owner, address _spender) public view returns (uint256 remaining)

    // 1、代币信息
    // 代币名称 name
    string private _name;

    // 代币标识 symbol
    string private _symbol;

    // 代币小数位数 decimals
    uint8 private _decimals;

    // 代币的总发行量 totalSupply
    uint256 private _totalSupply;

    // 代币数量(某个账户下的)  balance
    mapping(address => uint256) private _balances;

    // 授权代币数量 allowance
    /* 
      {
        0x5B38Da6a701c568545dCfcB03FcB875f56beddC4: {
          0x...01: 3000,
          0x...02: 1230
        }
      }
    */
    mapping(address => mapping(address => uint256)) private _allowances;

    // 2、初始化
    constructor() {
        _name = "RabbitCoin";
        _symbol = "RABTC";
        _decimals = 18;

        // 初始化货币池
        _mint(_msgSender(), 10 * 10000 * 10 ** _decimals);
    }

    // - 3、取值器 -
    // 返回代币的名字 name()
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // 根据地址获取余额
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    // 返回授权代币数量 allowanceOf()
    function allowanceOf(
        address owner,
        address spender
    ) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    // - 4、函数 -

    // 代币转发
    function transfer(address to, uint256 value) public returns (bool) {
        // 当前账号
        address owner = _msgSender();

        // 实现转账
        _transfer(owner, to, value);

        return true;
    }

    // 授权代币的转发
    // approve() 函数：IERC20 的 approve 函数， Token 授权逻辑。被授权方 spender 可以控制授权方的 amount 数量的 Token 。
    function approve(address spender, uint256 amount) public returns (bool) {
        // 当前账号
        address owner = _msgSender();

        // 批准转发
        // 授权人: owner
        // 被授权人：spender
        _approve(owner, spender, amount);

        return true;
    }

    // 授权代币转发
    // from ： 我从 from 借的钱
    // to ： 我 要给 to 转钱
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        address owner = _msgSender();

        _spendAllowance(from, owner, amount);

        // 执行转账
        // from: 银行
        // to: 我自己，中介公司，买房人
        _transfer(from, to, amount);
        return true;
    }

    // - 5、事件 -
    event Transfer(address from, address _to, uint256 _value);
    event Approval(address _owner, address _spender, uint256 _value);

    // - 6、合约内部事件 -
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer from the zero address");

        uint fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: insufficient balance");

        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        // 发送事件
        emit Transfer(from, to, amount);
    }

    // 合约内部函数
    // 发行函数
    function _mint(address account, uint256 amount) internal {
        // 不符合条件可以退回gas
        require(account != address(0), "ERC20: mint to the zero address");

        // 初始化货币数量
        _totalSupply += amount;

        unchecked {
            // 给某个账号注入起始资金
            _balances[account] += amount;
        }
    }

    // 授权
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: transfer from the zero address");
        require(spender != address(0), "ERC20: transfer from the zero address");

        // 执行授权
        _allowances[owner][spender] = amount;

        // 发送事件
        emit Approval(owner, spender, amount);
    }

    // A 授权给 B 代理 50元   B 转账或其他支出 30元  => A授权给B的代理扣 30 元 
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowanceOf(owner, spender);
        if(currentAllowance != type(uint256).max){
            // 余额不足报错拦截
            require(currentAllowance >= amount, "ERC20: insufficient balance");

            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
}
