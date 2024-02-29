<script setup>
import { showNotify } from "vant";
import { ref, defineProps, computed, onMounted, watchEffect } from "vue";
import Web3 from "web3";
import ethWallet, { hdkey } from "ethereumjs-wallet";
import { web3, handleTransaction } from "@/utils";
const props = defineProps(["walletInfoList"]);

const getFormatedWalletList = async () => {
  const promiseList = props.walletInfoList.map(async (item) => {
    const originalAdress = item.address;
    item.showAddress =
      originalAdress.slice(0, 8) + "..." + originalAdress.slice(-6);

    // 根据地址获取余额
    const balance = await web3.eth.getBalance(originalAdress);

    item.balance = web3.utils.fromWei(balance, "ether");

    return item;
  });

  const res = await Promise.all(promiseList);
  console.log("res: ", res);
  return res;
};

const formatedWalletList = ref([]);
onMounted(async () => {
  formatedWalletList.value = await getFormatedWalletList();
});

watchEffect(
  () => props.walletInfoList,
  async (newValue, oldValue) => {
    console.log("oldValue: ", oldValue);
    console.log("newValue: ", newValue);
    formatedWalletList.value = await getFormatedWalletList();
  }
);

const curKeyStore = ref({});
const curAddress = ref("");
const curPassword = ref("");
const show = ref(false);
const targetAccount = ref("0x9b5b532099b4500F39Cf4d342d25eC5162130406");

const getPassword = (item) => {
  show.value = true;
  curKeyStore.value = item.keyStore;
  curAddress.value = item.address;

  console.log("item: ", item);
  console.log("keyStore: ", item.keyStore);
};

const handleCancelTransaction = () => {
  show.value = false;
};

// 确认交易后
const handleConfirmTransaction = async () => {
  const password = curPassword.value;
  const keystore = curKeyStore.value;
  console.log("password: ", password);
  console.log("keystore: ", keystore);

  // 使用keystore和password获取钱包
  let walletobj;
  try {
    walletobj = await ethWallet.fromV3(keystore, password);
  } catch (err) {
    showNotify({
      type: "danger",
      message: "密码错误",
    });
    console.log("err: ", err);
    return false;
  }

  showNotify({
    type: "success",
    message: "密码正确,正在处理交易中...",
  });

  console.log("walletobj: ", walletobj);

  const privateKey = walletobj.getPrivateKey().toString("hex");
  const privateKey2 = Buffer(privateKey, "hex");
  const address = curAddress.value;

  console.log("privateKey: ", privateKey);
  console.log("address: ", address);
  console.log("privateKey2: ", privateKey2);
  console.log("targetAccount: ", targetAccount.value);

  // 0x9b5b532099b4500F39Cf4d342d25eC5162130406

  handleTransaction(
    address,
    `0x${privateKey}`,
    targetAccount.value,
    "0.000001",
    () => {
      show.value = false
      showNotify({
        type: "success",
        message: "交易成功！",
      });
    }
  );
  // 获取转账地址
};
</script>

<template>
  <div class="mt-4">
    <van-space direction="vertical">
      <van-cell
        v-for="item in formatedWalletList"
        :key="item.id"
        :title="item.showAddress"
        icon="user-o"
      >
        <template #right-icon>
          <van-button
            @click="() => getPassword(item)"
            size="small"
            class="w-[300px]"
            >{{ item.balance }}</van-button
          >
        </template>
      </van-cell>
    </van-space>

    <!-- 发起转账的弹窗 -->
    <van-dialog
      @confirm="handleConfirmTransaction"
      @cancel="handleCancelTransaction"
      :show="show"
      title="请确认交易信息"
      show-cancel-button
    >
      <van-cell-group inset>
        <van-field
          v-model="curPassword"
          type="password"
          label="密码："
        ></van-field>
        <van-field v-model="targetAccount" label="转入地址："> </van-field>
      </van-cell-group>
    </van-dialog>
  </div>
</template>


<style lang="less" scoped>
</style>