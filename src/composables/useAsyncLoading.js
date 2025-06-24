import { ref } from 'vue';

export const useAsyncLoading = () => {
    const isAsyncLoading = ref(false);
    const error = ref(null);

    const execute = async (asyncFunction) => {
        isAsyncLoading.value = true;
        error.value = null;
        try {
            const result = await asyncFunction();
            return result;
        } catch (err) {
            error.value = err;
            throw err;
        } finally {
            isAsyncLoading.value = false;
        }
    };

    return {
        isAsyncLoading,
        error,
        execute,
    };
};