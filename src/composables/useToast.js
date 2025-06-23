import { ref } from 'vue';

export const useToast = () => {
    const toasts = ref([]);
    const colorMap = {
        success: 'bg-success',
        error: 'bg-danger',
        primary: 'bg-primary',
    };

    const addToast = (message, color = 'primary', delay = 115000) => {
        const id = Date.now();
        toasts.value.unshift({ id, message, color: colorMap[color] || colorMap.primary, delay });
        setTimeout(() => removeToast(id), delay);
    };

    const removeToast = (id) => {
        toasts.value = toasts.value.filter(toast => toast.id !== id);
    };

    return {
        toasts,
        addToast,
        removeToast,
    };
};