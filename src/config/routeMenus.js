export const routeMenus = {
    'top': [
        {
            label: '管理',
            subMenu: 'menu#1',
        },
    ],
    'menu#1': [
        {
            label: 'アカウント管理',
            to: '/users',
            requiresAuth: true,
            roles: ['admin'],
            permissions: [''],
            showInMenu: true,
        },
        {
            label: 'アカウント管理',
            to: '/users/new',
            requiresAuth: true,
            roles: ['admin'],
            permissions: [''],
            showInMenu: false,
        },
        {
            label: 'アカウント管理',
            to: '/users/:code',
            requiresAuth: true,
            roles: ['admin'],
            permissions: [''],
            showInMenu: false,
        },
    ],
};