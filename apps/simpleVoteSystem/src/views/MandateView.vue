<script setup>
import useWeb3 from "@/hooks/useWeb3";
import { ref, onMounted } from "vue";
// import aaa from "my-contracts/contracts/MyToken/MyToken.json";

const { web3, voteContract, getAccount } = useWeb3();

// 定义主持人信息
const host = ref("");

// 获取主持人信息
const getHost = async () => {
  host.value = await voteContract.methods.host().call();
  console.log('host.value: ', host.value);
};

// 选民地址
const voterAddress = ref("");

// 分发票权
const mandate = async () => {
  const arr = eval(voterAddress.value);
  const account = await getAccount();
  voteContract.methods
    .mandate(arr)
    .send({ from: account })
    .on("receipt", () => {
      console.log("选票分发成功");
    });
};

onMounted(async () => {
  await getHost();
});
/*
  0x62815B4970983B8C58C2Fb649B6ba78b5BA05f70
  0xe4525BF45E1b1Cf46A136171BD51e63f4256a0DF
  0xE251ddBe6191594922bfd3d338529EC9C613eB67
  0xC76E9893BB9a75730Fc61d0169241fD80AD644f6
  ["0xe4525BF45E1b1Cf46A136171BD51e63f4256a0DF","0xE251ddBe6191594922bfd3d338529EC9C613eB67","0xC76E9893BB9a75730Fc61d0169241fD80AD644f6"]
*/
</script>

<template>
  <div class="p-4">
    <van-divider>分发票权</van-divider>
    <div class="mt-5">
      <van-field class="w-full" v-model="host" :readonly="true" label="主持人地址">
        <template #label>
          <p class="label"><van-icon name="manager" />主持人地址</p>
        </template>
      </van-field>
    </div>

    <div class="mt-5">
      <van-field
        label="投票人地址"
        placeholder="请输入"
        rows="4"
        type="textarea"
        class="w-full bg-[var(--van-background-2)]"
        v-model="voterAddress"
      >
        <template #label>
          <p class="label"><van-icon name="friends-o" />投票人地址</p>
        </template>
      </van-field>
    </div>
    <div class="mx-5 my-5">
      <van-button block @click="mandate">开始分发选票</van-button>
    </div>
  </div>
</template>

<style lang="scss"></style>
