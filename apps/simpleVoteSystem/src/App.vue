<script setup>
import { TabbarItem, Tabbar } from "vant"
import { ref } from "vue";
const active = ref(0);
</script>

<template>
  <div class="flex flex-col min-h-[100vh] max-h-[100vh] overflow-hidden">
    <nav class="header">去中心化投票APP</nav>

    <main class="flex-1 overflow-scroll">
      <router-view></router-view>
    </main>

    <Tabbar class="bottom-tabbar" :fixed="false" route v-model="active" active-color="#ee742f">
      <TabbarItem to="/" icon="gem-o">分发票权</TabbarItem>
      <TabbarItem to="/account" icon="balance-list-o">账户信息</TabbarItem>
      <TabbarItem to="/board" icon="orders-o">投票看板</TabbarItem>
    </Tabbar>
  </div>
</template>

<style lang="less" scoped>
.header {
  height: 44px;
  background-color: #ee742f;
  color: #fff;
  text-align: center;
  line-height: 44px;
  width: 100%;
}
</style>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.bottom-tabbar {
  min-height: var(--van-tabbar-height);
}

// main {
//   max-height: calc(100vh - 44px - 50px);
// }
</style>
