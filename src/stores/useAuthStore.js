import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/libs/api';
import { useUserStore } from '@/stores/useUserStore';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const userStore = useUserStore();

    const isAuth = computed(() => {
        return !!token.value;
    });

    const setToken = (newToken) => {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const { token: newToken } = response.data;
            setToken(newToken);
            await userStore.fetchUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const autoLogin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setToken(null);
            userStore.clearUser();
            return;
        }

        try {
            const response = await api.post('/api/auth/refresh');
            const { token: newToken } = response.data;
            setToken(newToken);
            await userStore.fetchUser();
        } catch (error) {
            console.error(error);
            await logout();
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error(error);
        } finally {
            setToken(null);
            userStore.clearUser();
        }
    };

    return {
        isAuth,
        login,
        autoLogin,
        logout,
    };
});