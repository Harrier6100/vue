import { ref, computed } from 'vue';

export const useFilter = (filterData) => {
    const keyword = ref('');

    const filteredData = computed(() => {
        return filterData.value.filter(item =>
            Object.values(item).some(value => {
                if (value === null || value === undefined) return false;
                return value.toString().toLowerCase().includes(keyword.value.toLowerCase());
            })
        );
    });

    return {
        keyword,
        filteredData,
    };
};