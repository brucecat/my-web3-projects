<template>
  <Tabs :active="active">

    <Tab title="我的代币">
      <MyToken01></MyToken01>
    </Tab>

    <Tab title="自制钱包">
      <MyWalletApp></MyWalletApp>
    </Tab>

    <Tab title="账户演示">
      <AccountSys></AccountSys>
    </Tab>

    <Tab title="web3 api测试">
      <Web3Api></Web3Api>
    </Tab>

    <Tab title="简易钱包">
      <Demo1></Demo1>
    </Tab>
  </Tabs>
</template>

<script setup>
import { Tabs, Tab } from "vant";
import AccountSys from "@/components/AccountSys.vue";
import Demo1 from "@/components/Demo1.vue";
import Web3Api from "@/components/Web3Api.vue";
import { defineComponent, ref, onMounted } from "vue";
import store2 from "store2";
import MyWalletApp from "@/components/MyWalletApp.vue";
import MyToken01 from "@/components/MyToken01.vue";

// import ButtonVue from "./components/Button.vue";
// import AccountList from "./components/AccountList.vue";

const walletInfo = ref([]);

onMounted(() => {
  walletInfo.value = store2.get("walletInfo") || [];
  console.log("walletInfo: ", walletInfo);
});
</script>