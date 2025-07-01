import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/useUserStore';

export const useUser = () => {
    const userStore = useUserStore();
    const { user, userName, userRole } = storeToRefs(userStore);
    const { fetchUser, clearUser } = userStore;

    return {
        user,
        userName,
        userRole,
        fetchUser,
        clearUser,
    };
};
