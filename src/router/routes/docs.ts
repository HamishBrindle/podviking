import { RouteConfig } from 'vue-router';

const config: Array<RouteConfig> = [
  {
    path: '/public/docs',
    component: () => import(/* webpackChunkName: "Docs" */ '@/views/Dashboard/Docs/index.vue'),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: ':doc',
        name: 'public-docs-md',
        component: () => import(/* webpackChunkName: "Docs" */ '@/views/Dashboard/Docs/Markdown.vue'),
        beforeEnter: (to, from, next) => {
          if (to.query.popped) {
            to.meta.layout = 'full-screen';
          }
          next();
        },
        props: (route) => {
          const p = { popped: '', doc: route.params.doc };
          if (route.query.popped) p.popped = 'yes';
          return p;
        },
      },
    ],
  },
];

export default config;
