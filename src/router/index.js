import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes = [];
const modules = import.meta.glob('./modules/*.js', { eager: true });
for (const path in modules) {
    routes.push(...modules[path].default ?? modules[path]);
}

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { isAuth, authAutoLogin } = useAuth();

    // if (to.path === '/error') {
    //     return next();
    // }

    if (!isAuth.value) {
        try {
            await authAutoLogin();
        } catch (error) {
            return next('/auth/error');
        }
    }

    // if (!isAuth.value && to.meta.requiresAuth) {
    //     sessionStorage.setItem('redirectTo', to.fullPath);
    //     return next('/error');
    // }

    next();
});

export default router;