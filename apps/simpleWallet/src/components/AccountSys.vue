<template>
  <div class="p-8">
    <Button type="primary" @click="genMnemonic">
      点击使用助记词查看钱包私钥
    </Button>
    <div>
      {{ mnemonicRef }}
    </div>
    <div>
      地址：{{ addressRef }}
    </div>
    <div>
      校验地址：{{ addressRef }}
    </div>
    <div>
      私钥：{{ addressRef }}
    </div>
  </div>
</template>

<script setup>
import { Button } from "vant";

import { mnemonicToSeed } from "bip39";
import { ref } from "vue";
import ethWallet, { hdkey } from "ethereumjs-wallet";
import Web3 from "web3";

// 创建助记词
// const mnemonic = bip39.generateMnemonic()
// console.log('mnemonic: ', mnemonic);

const web3 = new Web3(
  "wss://goerli.infura.io/ws/v3/b81f46011aa542aabcf245833f89c3fa"
);

const mnemonicRef = ref(
  "你的助记词"
);

const addressRef = ref("0x9211a661d1b356058487cb79031c4dcab710901a");
const checkAddressRef = ref('')
const privateRef = ref('')

// 生成密钥对 keypair
// const seed = mnemonicRef;

const genMnemonic = async () => {
  const seed = await mnemonicToSeed(mnemonicRef.value);
  console.log("seed: ", seed);

  const hdwallet = hdkey.fromMasterSeed(seed);
  console.log("hdwallet: ", hdwallet);

  //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
  const path = "m/44'/60'/0'/0/0";
  const keyPair = hdwallet.derivePath(path);

  console.log("keyPair: ", keyPair);

  // 获取私钥
  // 1.获取钱包对象
  const wallet = keyPair.getWallet();

  // 2.获取钱包地址
  const lowerCaseAddress = wallet.getAddressString();
  console.log("lowerCaseAddress: ", lowerCaseAddress);
  addressRef.value = lowerCaseAddress;

  // 3.获取钱包检验地址
  const checkAddress = wallet.getChecksumAddressString()
  console.log('checkAddress: ', checkAddress);
  checkAddressRef.value = checkAddress

  // 4.获取私钥
  const privatekey = wallet.getPrivateKey().toString("hex");
  console.log('privatekey: ', privatekey);
  privateRef.value = privatekey

  // 导出keyStore
  // 1、web3js
  const keyStore = web3.eth.accounts.encrypt(privatekey, "111111")
  console.log("keyStore:", JSON.stringify(keyStore))

  // 2、wallet对象
  const keyStore2 = await wallet.toV3("111111")
  console.log('keyStore2: ', JSON.stringify(keyStore2));

  // 通过keyStore获取私钥
  // 1、web3 
  const res = web3.eth.accounts.decrypt(keyStore, "111111");
  console.log('res: ', res);

  // 2、wallet
  const res2 = await ethWallet.fromV3(keyStore2, "111111")
  console.log('res2: ', res2);
  
  const key = res2.getPrivateKey().toString("hex")
  console.log('key: ', key);

  // 通过私钥获取地址
  const priKeyBuffer = Buffer(privatekey, "hex")
  const wallet3 = ethWallet.fromPrivateKey(priKeyBuffer)
  console.log('wallet3: ', wallet3);
  const lowerCaseAddress2 = wallet3.getAddressString()
  console.log('lowerCaseAddress2: ', lowerCaseAddress2);
};
</script>



<style lang="less" scoped>
</style>