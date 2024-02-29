<template>
  <div class="p-8">
    <div class="flex gap-4">
      <Button type="primary" @click="handleAccount"> 点击生成账号 </Button>
      <Button type="primary" @click="handleViewMyAccount">
        点击查看我的个人账号
      </Button>
      <Button type="primary" @click="handleViewNewAccount">
        点击查看生成的一个账号
      </Button>
      <Button
        type="primary"
        @click="
          () =>
            handleTransaction(
              myWalletAddress,
              myWalletPrivateKey,
              newWalletAddress,
              '0.0000001'
            )
        "
      >
        点击转账
      </Button>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">地址</div>
      <div>{{ addressRef }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">私钥</div>
      <div>{{ privateKeyRef }}</div>
    </div>
    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">余额(单位:Wei)</div>
      <div>{{ balanceRef?.eth ?? "" }}</div>
    </div>
    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">余额(单位:ETH)</div>
      <div>{{ balanceRef?.wei ?? "" }}</div>
    </div>

    <hr class="mt-8" />
    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">我的个人账户的地址</div>
      <div>{{ myWalletAddress }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">我的个人账户的私钥</div>
      <div>{{ myWalletPrivateKey }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">
        我的个人账户的余额(单位:Wei)
      </div>
      <div>{{ myWalletBalanceRef?.wei }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">
        我的个人账户的余额(单位:ETH)
      </div>
      <div>{{ myWalletBalanceRef?.eth }}</div>
    </div>

    <hr class="mt-8" />
    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">生成的账户的地址</div>
      <div>{{ newWalletAddress }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">生成的账户的私钥</div>
      <div>{{ newWalletPrivateKey }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">
        生成的账户的余额(单位:Wei)
      </div>
      <div>{{ newWalletBalanceRef?.wei }}</div>
    </div>

    <div class="flex gap-x-6 items-center mt-8">
      <div class="text-3xl font-semibold text-[orange]">
        生成的账户的余额(单位:ETH)
      </div>
      <div>{{ newWalletBalanceRef?.eth }}</div>
    </div>
  </div>
</template>

<script setup>
import { Button, showNotify } from "vant";
import Web3 from "web3";
import { ref, computed } from "vue";
import store from "store2";
import Tx from "ethereumjs-tx";
import "vant/es/notify/style";

// "wss://goerli.infura.io/ws/v3/cb7e63cf28244e4499b4b6fb6162e746"
const web3 = new Web3(
  "wss://goerli.infura.io/ws/v3/b81f46011aa542aabcf245833f89c3fa"
);

console.log("web3", web3);

// 我的钱包
const myWalletAddress = "0x9b5b532099b4500f39cf4d342d25ec5162130406";
const myWalletBalanceRef = ref(null);
const myWalletPrivateKey =
  "你的秘钥";

// 生成的一个账号
const newWalletAddress = "0x51Db5376c0c13A7ad322c8eB9A8D98d8777cD5e2";
const newWalletBalanceRef = ref(null);
const newWalletPrivateKey =
  "你的秘钥";

const accountRef = ref(null);
const addressRef = ref(store.get("wallet_address"));
const privateKeyRef = ref(store.get("wallet_privateKey"));
const balanceRef = ref(null);

const handleAccount = async () => {
  console.log("生成账号中...");

  const account = web3.eth.accounts.create("123456");
  console.log("account: ", account);

  accountRef.value = account;

  // 获取地址
  let address = account.address;
  console.log("address: ", address);
  addressRef.value = address;
  store.set("wallet_address", address);

  // 获取私钥
  const privateKey = account.privateKey;
  privateKeyRef.value = privateKey;
  store.set("wallet_privateKey", privateKey);

  //address：0xfF0B5A0AA68249cD161b606679DB49CBD9a12cd0

  // 获取余额
  const balance = await web3.eth.getBalance(address);
  console.log("balance: ", balance);
  const balanceWei = balance;
  const balanceEth = Web3.utils.fromWei(balanceWei);
  balanceRef.value = {
    wei: balanceWei,
    eth: balanceEth,
  };

  // 单位转化
  // const num1 = Web3.utils.toWei("0.3");
  // const num2 = web3.utils.toWei("0.3");
  // const num3 = Web3.utils.fromWei("3000000", "ether");
};

const handleViewMyAccount = async () => {
  const balance = await web3.eth.getBalance(myWalletAddress);
  console.log("balance: ", balance);

  // const balanceWei = Web3.utils.toWei(balance);
  const balanceWei = balance;
  const balanceEth = Web3.utils.fromWei(balanceWei);
  myWalletBalanceRef.value = {
    wei: balanceWei,
    eth: balanceEth,
  };
};

// 查看新账户
const handleViewNewAccount = async () => {
  const balance = await web3.eth.getBalance(newWalletAddress);
  console.log("balance: ", balance);

  const balanceWei = balance;
  const balanceEth = Web3.utils.fromWei(balanceWei);
  console.log("balanceEth: ", balanceEth);
  newWalletBalanceRef.value = {
    wei: balanceWei,
    eth: balanceEth,
  };
};

// 转账操作
const handleTransaction = async (
  fromAddress,
  fromPrivateKey,
  toAddress,
  ethNumber
) => {
  try {
    // 1.构建转账参数
    // 获取账户交易次数
    const transactionCount = await web3.eth.getTransactionCount(fromAddress);
    console.log('transactionCount: ', transactionCount);

    // 获取预计转账的 gas 费
    const gasPrice = await web3.eth.getGasPrice();
    console.log('gasPrice: ', gasPrice);

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

    console.log('rawTx: ', rawTx);

    // gas估算
    const gas = await web3.eth.estimateGas(rawTx);
    console.log("gas: ", gas);
    rawTx.gas = gas;

    // 2.生成 serializedTx
    // 转化私钥
    // 将私钥去除“ox”后进行hex转化
    const privateKey = Buffer(fromPrivateKey.slice(2), "hex");
    console.log("privateKey: ", privateKey);

    // ethereumjs-tx 实现私钥加密
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    console.log('tx: ', tx);

    // 生成 serializedTx
    // 发送账户的地址  从这个账户里面取出来
    const serializedTx01 = tx.serialize();
    const serializedTx02 = `0x${tx.serialize().toString("hex")}`;

    console.log("serializedTx01: ", serializedTx01);
    console.log("serializedTx02: ", serializedTx02);

    // 开始转账
    const transaction = web3.eth.sendSignedTransaction(serializedTx02);
    transaction.on("transactionHash", (txid) => {
      console.log("交易ID: ", txid);
      console.log(`详情地址: https://goerli.etherscan.io/tx/${txid}`);
    });

    transaction.on("receipt", (receipt) => {
      console.log("receipt: ", receipt);
      console.log("第一个节点确认");
      showNotify({
        type: "success",
        message: "交易成功！",
    });
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
</script>



<style lang="less" scoped>
</style>