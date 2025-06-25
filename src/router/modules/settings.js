export default [
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/pages/Setting.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/setting/profile',
        name: 'SettingProfile',
        component: () => import('@/pages/SettingProfile.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/setting/profile/name',
        name: 'SettingProfileName',
        component: () => import('@/pages/SettingProfileName.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/setting/profile/email',
        name: 'SettingProfileEmail',
        component: () => import('@/pages/SettingProfileEmail.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/setting/password',
        name: 'SettingPassword',
        component: () => import('@/pages/SettingPassword.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];