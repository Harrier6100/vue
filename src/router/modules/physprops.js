export default [
    {
        path: '/physprops',
        name: 'PhyspropList',
        component: () => import('@/pages/PhyspropList.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprops/add',
        name: 'PhyspropAdd',
        component: () => import('@/pages/PhyspropEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprops/:code',
        name: 'PhyspropEdit',
        component: () => import('@/pages/PhyspropEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/specs',
        name: 'PhyspropSpecList',
        component: () => import('@/pages/PhyspropSpecList.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/specs/add',
        name: 'PhyspropSpecAdd',
        component: () => import('@/pages/PhyspropSpecEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/specs/:productCode/:customerCode?',
        name: 'PhyspropSpecEdit',
        component: () => import('@/pages/PhyspropSpecEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/values',
        name: 'PhyspropValueList',
        component: () => import('@/pages/PhyspropValueList.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/values/add',
        name: 'PhyspropValueAdd',
        component: () => import('@/pages/PhyspropValueEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];