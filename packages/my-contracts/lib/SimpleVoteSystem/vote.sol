// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Vote {
    // 构建投票人结构体
    struct Voter {
        // 票数
        uint256 amount;
        // 是否投过票
        bool isVoted;
        // 代理人地址
        address delegator;
        // 目标ID
        uint256 targetId;
    }

    // 投票看板结构体
    struct Board {
        // 目标名字
        string name;
        // 票数
        uint256 totalAmount;
    }

    // 主持人信息
    address public host;

    // 投票人集合
    mapping(address => Voter) public voters;

    // 主题集合
    Board[] public board;

    // 数据初始化
    constructor(string[] memory nameList) {
        // 部署合约者为主持人
        host = msg.sender;

        // 给主持人初始化一票
        voters[host].amount = 1;

        // 初始化board
        for (uint256 i = 0; i < nameList.length; i++) {
            Board memory boardItem = Board(nameList[i], 0);
            board.push(boardItem);
        }
    }

    // 返回看板集合
    function getBoardInfo() public view returns (Board[] memory) {
        return board;
    }

    // 给某些地址赋予选票
    function mandate(address[] calldata addressList) public {
        // 只有主持人可以调用
        require(msg.sender == host, "Only the owner has permissions");

        for (uint256 i = 0; i < addressList.length; i++) {
          // 如果该地址已经投过了票，不做处理
          if(!voters[addressList[i]].isVoted) {
            voters[addressList[i]].amount = 1;
          }
        }
    }

    // 将投票权委托给别人
    function delegate(address to) public {
      // 获取委托人的地址
      Voter storage sender = voters[msg.sender];

      // 如果委托人已经投过票了，就不能再委托别人投票了
      require(!sender.isVoted, unicode"你已经投过票了！");

      // 不能委托给自己
      require(msg.sender != to, unicode"不能委托给自己。");

      // 避免闭环 
      while(voters[to].delegator != address(0)){
        to = sender.delegator;
        require(to == msg.sender, unicode"不能循环授权!");
      }

      // 开始授权
      sender.isVoted = true;
      sender.delegator = to;

      // 获取代理人
      Voter storage delegator_ = voters[to];
      if(delegator_.isVoted){
        // 追加票数，投的和之前投过的一样
        board[delegator_.targetId].totalAmount += sender.amount;
      } else {
        delegator_.amount += sender.amount;
      }
    }

    // 投票
    function vote(uint256 targetId) public {
      Voter storage sender = voters[msg.sender];
      require(sender.amount != 0, "Has no right to vote.");
      require(!sender.isVoted, "Already voted.");

      sender.isVoted = true;
      
      sender.targetId = targetId;
      board[targetId].totalAmount += sender.amount;
      emit voteSuccess(unicode"投票成功~~");
    }

    // 投票成功事件
    event voteSuccess(string);

    // 计算投票结果
    function winningProposal() public view returns (uint winningProposal_){
      uint winningVoteCount = 0;
      for (uint p = 0; p < board.length; p++) {
          if (board[p].totalAmount > winningVoteCount) {
              winningVoteCount = board[p].totalAmount;
              winningProposal_ = p;
          }
      }
    }
}
