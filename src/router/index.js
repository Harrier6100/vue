import { createRouter, createWebHistory } from 'vue-router';

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
    next();
});

export default router;