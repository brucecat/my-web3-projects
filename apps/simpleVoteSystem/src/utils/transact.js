import Web3 from "web3";
// import ethWallet, { hdkey } from "ethereumjs-wallet";
import Tx from "ethereumjs-tx";

export const web3 = new Web3(
  "wss://goerli.infura.io/ws/v3/b81f46011aa542aabcf245833f89c3fa"
);


// 转账函数
export const handleTransaction = async (
  fromAddress,
  fromPrivateKey,
  toAddress,
  ethNumber,
  onOk
) => {
  try {
    // 1.构建转账参数
    // 获取账户交易次数
    const transactionCount = await web3.eth.getTransactionCount(fromAddress);
    console.log("transactionCount: ", transactionCount);

    // 获取预计转账的 gas 费
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice: ", gasPrice);

    // 转账金额
    const value = web3.utils.toWei(ethNumber);

    console.log("转账金额(Wei): ", value);

    // 核心内容
    const rawTx = {
      from: fromAddress,
      to: toAddress,
      nonce: transactionCount,
      gasPrice,
      value,

      //转Token代币会用到的一个字段
      data: "0x0000",
    };

    // gas估算
    const gas = await web3.eth.estimateGas(rawTx);
    rawTx.gas = gas;

    // 2.生成 serializedTx
    // 转化私钥
    // 将私钥去除“ox”后进行hex转化
    const privateKey = Buffer(fromPrivateKey.slice(2), "hex");

    // ethereumjs-tx 实现私钥加密
    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    // 生成 serializedTx
    // 发送账户的地址  从这个账户里面取出来
    const serializedTx01 = tx.serialize();
    const serializedTx02 = `0x${tx.serialize().toString("hex")}`;


    // 开始转账
    const transaction = web3.eth.sendSignedTransaction(serializedTx02);

    // 打印
    console.log("转出账户地址", fromAddress)
    console.log("转入账户地址", toAddress)
    console.log("预计gas", gas)



    transaction.on("transactionHash", (txid) => {
      console.log("交易ID: ", txid);
      console.log(`详情地址: https://goerli.etherscan.io/tx/${txid}`);
    });

    transaction.on("receipt", (receipt) => {
      console.log("receipt: ", receipt);

      typeof onOk === 'function' && onOk()
    });

    transaction.on("confirmations", (res) => {
      console.log("第N个节点确认", res);
    });

    transaction.on("error", (err) => {
      console.log("error:" + err);
    });
  } catch (err) {
    console.log("err: ", err);
  }
};