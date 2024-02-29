import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import MandateView from "@/views/MandateView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MandateView,
  },
  {
    path: "/account",
    name: "account",
    component: () =>
      import(/* webpackChunkName: "account" */ "@/views/AccountView.vue"),
  },
  {
    path: "/board",
    name: "board",
    component: () =>
      import(/* webpackChunkName: "board" */ "@/views/BoardView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
