export default [
    {
        path: '/users',
        name: 'UserList',
        component: () => import('@/pages/UserList.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/users/add',
        name: 'UserAdd',
        component: () => import('@/pages/UserEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/users/:id',
        name: 'UserEdit',
        component: () => import('@/pages/UserEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];