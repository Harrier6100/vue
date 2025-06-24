import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import { useUserStore } from '@/stores/useUserStore';

export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref(false);
    const userStore = useUserStore();
    
    const authLogin = async (credentials) => {
        try {
            const response = await api.post(`/api/auth/login`, credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);
            isAuth.value = true;

            await userStore.fetchUser();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const authAutoLogin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            isAuth.value = false;
            return;
        }

        try {
            const response = await api.post(`/api/auth/refresh`);
            const { token: newToken } = response.data;
            localStorage.setItem('token', newToken);
            isAuth.value = true;

            await userStore.fetchUser();
        } catch (error) {
            await logout();
        }
    };

    const authLogout = async () => {
        try {
            await api.post(`/api/auth/logout`);
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem('token');
        isAuth.value = false;

        userStore.clearUser();
    };

    return {
        isAuth,
        authLogin,
        authAutoLogin,
        authLogout,
    };
});