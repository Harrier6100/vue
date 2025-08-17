import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useUser } from '@/composables/useUser';
import { createRouteMeta } from '@/utils/createRouteMeta';
import { routeMenus } from '@/config/routeMenus';

const routes = [];
const routeMeta = createRouteMeta(routeMenus);
const modules = import.meta.glob('./modules/*.js', { eager: true });
for (const module in modules) {
    const route = modules[module];
    const routeDefs = Array.isArray(route.default) ? route.default : [route.default];
    routeDefs.forEach(routeDef => {
        routes.push({
            ...routeDef,
            meta: {
                ...(routeDef.meta || {}),
                ...(routeMeta[routeDef.path] || {}),
            },
        });
    });
}

const router = createRouter({
    history: createWebHistory(),
    routes,
});

let isAutoLoginChecked = false;

router.beforeEach(async (to, from, next) => {
    const { isAuth, autoLogin } = useAuth();
    const { role, permissions } = useUser();

    if (!isAutoLoginChecked) {
        isAutoLoginChecked = true;
        await autoLogin();
    }

    if (to.meta.requiresAuth) {
        if (!isAuth.value) {
            sessionStorage.setItem('requestURL', to.fullPath);
            return next('/401');
        }

        if ((to.meta.roles?.length || 0) > 0 || (to.meta.permissions?.length || 0) > 0) {
            const hasRole = to.meta.roles?.includes(role.value) ?? false;
            const hasPermission = to.meta.permissions?.some(permission => permissions.value.includes(permission)) ?? false;
            if (!hasRole && !hasPermission) {
                return next('/403');
            }
        }
    }

    next();
});

export default router;