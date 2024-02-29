<template>
  <div class="p-8">
    <h1>web3 与智能合约</h1>

    <h1>代币信息</h1>
    名称: {{ name }} <br />
    标识: {{ symbol }} <br />
    发行量 {{ ts }} <br />

    <Divider />
    <h2>账户信息</h2>

    <div>
      <Card v-for="(account, index) in Object.keys(acToBaMap)" :key="account">
        <template #desc>
          <div>
            账户{{ index + 1 }}地址:
            {{ account || "-" }}
          </div>

          <div class="mt-8">余额: {{ acToBaMap[account] }}</div>
        </template>
      </Card>
    </div>

    <Divider />
    <h2>操作</h2>
    <div>默认付款账户: {{ currentAccount?.[1] }}</div>
    <Field v-model="toAddress" label="收款地址" />
    <Field v-model="money" type="number" label="金额" />
    <Button @click="send" type="primary">转账</Button>
  </div>
</template>

<script setup>
import { Button, showNotify, Divider, Card, Field } from "vant";
import Web3 from "web3";
import { ref, computed, onMounted } from "vue";
import store from "store2";
import Tx from "ethereumjs-tx";
import "vant/es/notify/style";
import mtcJSON from "my-contracts/contracts/MyToken/MyToken.json";

const web3 = new Web3(
  Web3.givenProvider ||
    "wss://goerli.infura.io/ws/v3/b81f46011aa542aabcf245833f89c3fa"
);

const mtcContractAddress = "0x18b7dc3704994c7c0aa6e3e5af7ae85b94e4c437";
const mtcContract = new web3.eth.Contract(mtcJSON.abi, mtcContractAddress);

const formatEther = (val) => {
  return web3.utils.fromWei(String(val), "ether");
};

// 代币信息
const name = ref("");
const symbol = ref("");
const totalSupply = ref(0);
const balanceOf = ref(0);
const currentAccount = ref("");

// 账户=>余额 map
const acToBaMap = ref({});

// 获取货币信息
const getCoinInfo = async () => {
  if (typeof window.ethereum === "undefined") {
    console.log("MetaMask is not installed!");
    return;
  }

  // 多个账户
  const account = await web3.eth.requestAccounts();
  console.log("account: ", account);

  if (Array.isArray(account) && account.length > 0) {
    currentAccount.value = account;
    const infoItem = {
      name: await mtcContract.methods.name().call(),
      symbol: await mtcContract.methods.name().call(),
      totalSupply: await mtcContract.methods.totalSupply().call(),
      balanceOf: await mtcContract.methods.balanceOf(account[0]).call(),
    };

    name.value = infoItem.name;
    symbol.value = infoItem.symbol;
    totalSupply.value = infoItem.totalSupply;
    balanceOf.value = infoItem.balanceOf;

    // 多个账户的余额
    const accountBalances = await Promise.all(
      account.map(async (acc) => {
        const curBalance = await mtcContract.methods.balanceOf(acc).call();
        return formatEther(curBalance);
      })
    );

    account.forEach((account, accIndex) => {
      acToBaMap.value[account] = accountBalances[accIndex];
    });

    console.log("infoItem: ", infoItem);
    console.log("acToBaMap: ", acToBaMap.value);
  }
};

const ts = computed(() => {
  return formatEther(totalSupply.value);
});

const bo = computed(() => {
  return formatEther(balanceOf.value);
});

console.log("web3", web3);

onMounted(() => {
  getCoinInfo();
});

// 转账功能
const toAddress = ref("");
const money = ref(0);
const send = async () => {
  try {
    const weiAmount = web3.utils.toWei(String(money.value), "ether");

    // 需要gas调用send,不需要则用call
    mtcContract.methods
      .transfer(toAddress.value, weiAmount)
      .send({
        from: currentAccount.value[1],
      })
      .on("receipt", (res) => {
        console.log("交易成功");
        console.log("receipt: ", res);
      });
  } catch (error) {
    console.log("error: ", error);
  }
};
</script>



<style lang="less" scoped>
</style>