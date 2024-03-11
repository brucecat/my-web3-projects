// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// 去中心化投票
contract Vote {
    // 构建投票人结构体
    struct Voter {
        // 票数
        uint16 amount;
        // 是否投票
        bool isVoted;
        // 代理人地址
        address delegator;
        // 目标id
        uint256 targetId;
    }
    // 投票看板结构体
    struct Board {
        // 目标名字
        string name;
        // 目标票数
        uint256 totalAmount;
    }

    // 主持人信息
    address public host;

    // 投票人集合
    mapping(address => Voter) public voters;

    // 投票结果集合（主题集合）
    Board[] public board;

    // 初始化 ["刘能","谢广坤","赵四"]
    constructor(string[] memory nameList) {
        host = msg.sender;
        // 主持人初始化1票
        voters[host].amount = 1;
        for(uint256 i = 0; i < nameList.length; i++) {
            string memory cur = nameList[i];
            Board memory b = Board(cur, 0);
            board.push(b);
        }
    }

    // 返回看板集合
    function getBoardInfo() public view returns (Board[] memory) {
        return  board;
    }

    // 给地址赋予选票
    // ["0xbC1b6866204241EcDbc94071717a8043082Bfc2E", "0x59e19bfae42C786c5eC4EF0abe68f64707D02C6f","0xBb9429df9151ba6c88dC3e163403aC7Ed33354E3"]
    // ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
    function mandate(address[] calldata addressList) public {
        // 只有主持人才能调用
        require(msg.sender == host, unicode"只有主持人才能赋予选票");
        for (uint8 i = 0; i<addressList.length; i++) {
            // 如果该地址没有投过票，才去处理
            address cur = addressList[i];
            if (!voters[cur].isVoted) {
                voters[cur].amount = 1;
            }
        }
    }

    event VoteSuccess(string);

    function checkVoter(Voter memory voter) internal pure {
        require(voter.amount > 0, unicode"没有选票了！");
        require(!voter.isVoted, unicode"已经投过票啦！");
    }

    // 委托投票
    function delegate(address to)    public {
        // 获取委托人信息
        Voter storage sender = voters[msg.sender];
        checkVoter(sender);
        require(msg.sender != to, unicode"不能委托给自己！");
        // 避免循环委托
        while(voters[to].delegator != address(0)) {
            to = voters[to].delegator;
            require(to == msg.sender, unicode"不能循环委托！");
        }
        // 开始授权
        sender.isVoted = true;
        sender.delegator = to;

        // 获取代理人信息
        Voter storage delegator = voters[to];
        if (delegator.isVoted) {
            // 投过票了，追票
            board[delegator.targetId].totalAmount += sender.amount;
        } else {
            // 没投过票,增加票数
            delegator.amount += sender.amount;
        }
        sender.amount = 0;
    }

    // 投票
    function vote(uint8 targetId) public {
        Voter storage sender = voters[msg.sender];
        checkVoter(sender);
        sender.targetId = targetId;
        board[targetId].totalAmount += sender.amount;
        sender.amount = 0;
        sender.isVoted = true;
        emit VoteSuccess(unicode"投票成功！");
    }
}
