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
    {
      path: "/usersearch",
      name: "UserSearch",
      component: () => import("../components/UserSearch.vue"),
    },
  ],
});

export default router;
