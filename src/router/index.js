import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../components/HomeLogin.vue"),
    },
    {
      path: "/todolist",
      name: "Todolist",
      component: () => import("../components/TodoList.vue"),
    },
  ],
});

export default router;
