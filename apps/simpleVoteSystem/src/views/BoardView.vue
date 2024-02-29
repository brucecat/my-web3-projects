<script setup>
import useWeb3 from "../hooks/useWeb3";
import { ref, onMounted } from "vue";
const { web3, voteContract, getAccount } = useWeb3();

// 看板信息
const board = ref([]);

const account = ref("");

const getBoardInfo = async () => {
  const result = await voteContract.methods.getBoardInfo().call();
  board.value = result;
};

const vote = async (index) => {
  const account = await getAccount();
  const result = await voteContract.methods.vote(index).send({ from: account });
};

const initEventListen = () => {
  voteContract.events
    .voteSuccess({ fromBlock: 0 }, (err, event) => {
      console.log("监听执行");
      console.log(event);
    })
    .on("data", (event) => {
      console.log("智能合约触发的事件：", event.returnValues);
    });
};

onMounted(() => {
  initEventListen();
  getBoardInfo();
});
</script>

<template>
  <div class="box3">
    <van-divider>投票看板</van-divider>
    <van-cell :title="item.name" icon="shop-o" v-for="(item, index) in board" :key="item.name" >
      <template #right-icon>
        <van-button @click="vote(index)">{{ item.totalAmount }}</van-button>
      </template>
    </van-cell>
  </div>
</template>

<style lang="less"></style>
