import Web3 from "web3";
import VoteJSON from "my-contracts/lib/SimpleVoteSystem/Vote.json";

const useWeb3 = () => {
  const web3 = new Web3(
    Web3.givenProvider ||
      "wss://goerli.infura.io/ws/v3/cb7e63cf28244e4499b4b6fb6162e746"
  );
  
  const contractAddress = "0x1a2ee10B320a8D6518126b2884484111ee756A71";
  const voteContract = new web3.eth.Contract(VoteJSON.abi, contractAddress);

  const getAccount = async () => {
    const accounts = await web3.eth.requestAccounts();
    return accounts[0];
  };

  return {
    web3,
    voteContract,
    contractAddress,
    getAccount,
  };
};

export default useWeb3;
