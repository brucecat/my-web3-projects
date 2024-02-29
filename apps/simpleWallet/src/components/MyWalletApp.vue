<template>
  <div class="m-8">
    <van-space direction="horizontal">
      <van-button type="primary" @click="handleOpenDialog">创建钱包</van-button>
      <van-button type="primary">导入钱包</van-button>

      <!-- 二次确认助记词 -->
      <template v-if="showMnemonic">
        <div class="border border-dark-100">
          {{ mnemonicRef }}
        </div>
        <van-button type="primary" @click="handleCopyMnemonic">
          点击拷贝助记词,并进行验证
        </van-button>
      </template>
    </van-space>

    <!-- 账户列表 -->
    <MyAccountList :wallet-info-list="walletInfoList"></MyAccountList>

    <van-dialog
      @confirm="handleConfirm"
      @cancel="handleCloseDialog"
      ref="dialogRef"
      :show="show"
      title="请输入密码"
      show-cancel-button
    >
      <van-cell-group inset>
        <van-field v-model="password" label="密码：" type="password" />
      </van-cell-group>
    </van-dialog>

    <van-dialog
      @confirm="handleConfirmMnemonic"
      @cancel="handleCloseConfirmDialog"
      :show="showMnemonicConfirm"
      title="请输入助记词"
    >
      <van-cell-group inset>
        <van-field
          v-model="confirmMnemonicRef"
          label="助记词："
          type="textarea"
        >
        </van-field>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script setup>
import { showNotify } from "vant";
import { ref, computed } from "vue";
import "vant/es/notify/style";
import * as bip39 from "bip39";
import { copyToClipboard } from "@/utils/copy";
import { hdkey } from "ethereumjs-wallet";
import store2 from "store2";
import MyAccountList from "./MyAccountList.vue";

const show = ref(false);
const password = ref("");
const dialogRef = ref(null);

const handleOpenDialog = () => {
  show.value = true;
};

const handleCloseDialog = () => {
  show.value = false;
};

const handleConfirm = () => {
  console.log("确认");

  if (password.value.length < 1) {
    showNotify({
      type: "danger",
      message: "密码不能为空",
    });
    return;
  } else if (password.value.length < 6) {
    showNotify({
      type: "danger",
      message: "密码需要大于6位",
    });
    return;
  }

  handleCloseDialog();

  // 创建钱包
  handleCreateWallet();
};

// 创建钱包逻辑
// 助记词
const mnemonicRef = ref("");
const handleCreateWallet = async () => {
  const walletInfoList = store2.get("walletInfoList");
  console.log("walletInfoList: ", walletInfoList);

  const mnemonic =
    Array.isArray(walletInfoList) && walletInfoList.length > 0
      ? walletInfoList[0]["mnemonic"]
      : bip39.generateMnemonic();

  mnemonicRef.value = mnemonic;

  // 有已经存储的助记词 =>  直接生成账户
  const storeWalletList = store2.get("walletInfoList") || [];
  if (storeWalletList.length > 0) {
    await createAccountByMnemonic();

    showNotify({
      type: "success",
      message: "成功生成账户",
    });

    return;
  }

  // 否则需要经过二次确认
  showMnemonic.value = true;
};

// 用户 二次确认助记词
const handleCopyMnemonic = () => {
  copyToClipboard(mnemonicRef.value, () => {
    showNotify({
      type: "success",
      message: "成功拷贝助记词",
    });

    handleOpenConfirmDialog();
  });
};

// 助记词模块
const showMnemonic = ref(false);
const showMnemonicConfirm = ref(false);
const handleOpenConfirmDialog = () => {
  showMnemonicConfirm.value = true;
};
const handleCloseConfirmDialog = () => {
  showMnemonicConfirm.value = false;
};

const confirmMnemonicRef = ref("");

// 确认助记词
const handleConfirmMnemonic = async () => {
  console.log("mnemonicRef", mnemonicRef.value);
  console.log("confirmMnemonicRef", confirmMnemonicRef.value);

  // 生成
  if (mnemonicRef.value === confirmMnemonicRef.value) {
    await createAccountByMnemonic();

    showNotify({
      type: "success",
      message: "确认成功",
    });

    handleCloseConfirmDialog();
  } else {
    showNotify({
      type: "danger",
      message: "确认失败",
    });
  }
};

// 通过助记词创建账户
const createAccountByMnemonic = async () => {
  const walletInfoList = Array.isArray(store2.get("walletInfoList"))
    ? store2.get("walletInfoList")
    : [];

  // 第几个账户
  const addressIndex =
    walletInfoList.length === 0 ? 0 : walletInfoList.length + 1;

  const seed = await bip39.mnemonicToSeed(mnemonicRef.value);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const keyPair = hdwallet.derivePath(`m/44'/60'/0'/0/${addressIndex}`);

  const wallet = keyPair.getWallet();

  const lowerCaseAddress = wallet.getAddressString();
  const privateKey = wallet.getPrivateKey().toString("hex");
  const keyStore = await wallet.toV3(password.value);

  const walletInfo = {
    id: addressIndex,
    address: lowerCaseAddress,
    privateKey: privateKey,
    keyStore: keyStore,
    mnemonic: mnemonicRef.value,
    balance: 0,
  };

  console.log("walletInfo: ", walletInfo);

  // 存储到本地
  walletInfoList.push(walletInfo);
  store2.set("walletInfoList", walletInfoList);
};

const walletInfoList = computed(()=>{
  return store2.get("walletInfoList") || []
})
</script>

<style lang="less" scoped>
</style>