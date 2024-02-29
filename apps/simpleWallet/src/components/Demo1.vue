<template>
  <div class="app">
    <h1>手撕 eth 钱包</h1>
    <button @click="createWallet">创建钱包</button>
    <p>账户地址: {{ data.address }}</p>
    <p>账户私钥: {{ data.prikey }}</p>
    <p>账户余额: {{ eth }}</p>

    <h3>发起转账</h3>
    接受方:<input type="text" v-model="to.address" /> <br />
    金额 eth: <input type="text" v-model="to.money" /> <br />
    <button @click="sendETH">转账</button>
  </div>
</template>

<script setup>
import ethwallet, { hdkey } from "ethereumjs-wallet";
import * as bip39 from "bip39";
import Tx from "ethereumjs-tx";
import Web3 from "web3";
import { reactive, ref } from "vue";


const geerliWS =
  "wss://goerli.infura.io/ws/v3/e4f789009c9245eeaad1d93ce9d059bb";

const web3Instance = new Web3(Web3.givenProvider || geerliWS);

const to = reactive({
  address: "0xE251ddBe6191594922bfd3d338529EC9C613eB67",
  money: "0.01",
});

const eth = ref(0);
const data = reactive(JSON.parse(localStorage.getItem("walletObj")) || {});

// 获取余额
async function getBalance(address) {
  // 查询余额地址
  const num = await web3Instance.eth.getBalance(address);
  eth.value = Web3.utils.fromWei(num, "ether");
}
getBalance(data.address || "");

// 向其他的地址发起转账

async function sendETH() {
  // 1. 转账的地址 转账的金额
  // 2. 获取私钥
  // 3. 通过私钥将转账的数据进行加密
  // 4. 将加密的数据通过send 方法调用
  // 5. 监听区块链节点确认
  // 获取当前地址的交易数
  // 通过 keystore 密码 解密私钥
  const pass = prompt("请输入密码");
  const keystore = data.keystore;
  const wallet = await ethwallet.fromV3(keystore, pass);
  let key = wallet.getPrivateKey().toString("hex");
  // 通过私钥 将数据加密 将私钥转化为buffer类型
  var privateKey = new Buffer(key, "hex");
  const nonce = await web3Instance.eth.getTransactionCount(data.address);
  // 将money 转化为wei为单位
  let valueWei = Web3.utils.toWei(to.money);
  // 获取预估的手续费
  const gasPrice = await web3Instance.eth.getGasPrice();
  // 转账的参数
  var rawTx = {
    from: data.address, // 发送方的地址
    nonce: nonce, // 发送方的地址交易数量
    gasPrice: gasPrice, // 预估的手续费的价格
    to: to.address, // 接收方的地址
    value: valueWei, // 转账的金额要以wei为单位
    data: "0x00", //转Token代币会用到的一个字段
  };
  // 根据数据量 计算最终的gas费用
  const gas = await web3Instance.eth.estimateGas(rawTx);
  rawTx.gas = gas;

  // 通过tx实现交易对象的加密操作
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  console.log(tx);
  var serializedTx = tx.serialize();
  var transationHx = "0x" + serializedTx.toString("hex");
  console.log(transationHx);
  // 将加密出来交易hash 广播到区块链上
  web3Instance.eth
    .sendSignedTransaction(transationHx)
    .on("transactionHash", (txid) => {
      console.log("广播成功,请在区块链浏览器查看");
      console.log("交易id", txid);
      console.log(`https://goerli.etherscan.io/tx/${txid}`);
    })
    .on("receipt", (ret) => {
      console.log("交易成功矿工确认", ret);
      // 转账成功后更新页面
      getBalance();
    });
}

// 创建钱包
async function createWallet() {
  const pass = prompt("请输入密码");
  // 1. 创建12个单词的助记词
  // 2. 使用助记词产生分层钱包
  // 3. 获取钱包的账户信息  address 私钥
  // 创建助记词
  let mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
  //1.将助记词转成seed（加密的种子）
  let seed = await bip39.mnemonicToSeed(mnemonic);
  // console.log(seed);
  //3.通过hdkey将seed生成HD Wallet
  let hdWallet = hdkey.fromMasterSeed(seed);
  // console.log(hdWallet);
  //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
  let keyPair = hdWallet.derivePath("m/44'/60'/0'/0/0");
  // console.log(keyPair);
  // 获取钱包对象
  let wallet = keyPair.getWallet();
  console.log(wallet);
  // 获取钱包地址
  let lowerCaseAddress = wallet.getAddressString();
  // // 获取钱包校验地址
  let CheckSumAddress = wallet.getChecksumAddressString();
  console.log("lowerCaseAddress", lowerCaseAddress);
  console.log("CheckSumAddress", CheckSumAddress);

  // // 获取私钥
  let prikey = wallet.getPrivateKey().toString("hex");
  console.log("prikey", prikey);

  // console.log(prikey, data.pass1);
  // let keystore = await wallet.toV3(data.pass1);

  // 将私钥加密码转化为 keystore
  let keystore = await wallet.toV3(pass);
  console.log(keystore);
  const walletObj = {
    address: lowerCaseAddress,
    prikey,
    keystore,
  };
  localStorage.setItem("walletObj", JSON.stringify(walletObj));
  // 0xE251ddBe6191594922bfd3d338529EC9C613eB67 3.3269
}
</script>
<style lang="less">
.app {
  width: 100vw;
  height: 100vh;
}
</style>
