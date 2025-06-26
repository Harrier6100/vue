export default [
    {
        path: '/physprop/names',
        name: 'PhyspropNameList',
        component: () => import('@/pages/PhyspropNameList.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/names/add',
        name: 'PhyspropNameAdd',
        component: () => import('@/pages/PhyspropNameEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/physprop/names/:code',
        name: 'PhyspropNameEdit',
        component: () => import('@/pages/PhyspropNameEdit.vue'),
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
        path: '/physprop/values/add',
        name: 'PhyspropValueAdd',
        component: () => import('@/pages/PhyspropValueEdit.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];