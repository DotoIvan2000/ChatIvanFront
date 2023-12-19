const routes = [
  { path: "/login", component: () => import("src/pages/LoginList.vue") },
  { path: "/register", component: () => import("src/pages/RegisterList.vue") },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/users", component: () => import("src/pages/UsersList.vue") },
      { path: "/teams", component: () => import("src/pages/TeamsList.vue") },
      {
        path: "/notifications",
        component: () => import("src/pages/NotificationsList.vue"),
      },
      {
        path: "/aprooves",
        component: () => import("src/pages/AprobationList.vue"),
      },
      {
        path: "/followers",
        component: () => import("src/pages/FollowerList.vue"),
      },
      {
        path: "/followees",
        component: () => import("src/pages/FollowerInverseList.vue"),
      },
      {
        path: "/joinpro",
        component: () => import("src/pages/CreateProList.vue"),
      },
      {
        path: "/searchpeople",
        component: () => import("src/pages/SearchPeople.vue"),
      },
      {
        path: "/myteams",
        component: () => import("src/pages/MyTeamList.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
