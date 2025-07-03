export default [
    {
        path: '/sandbox',
        name: 'Sandbox',
        component: () => import('@/pages/Sandbox.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];