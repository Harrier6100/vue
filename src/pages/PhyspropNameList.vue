<template>
    <div class="container-fluid">
        <div class="mb-3">物性名</div>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" type="text" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" type="button" @click="addPhyspropName">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('code')" @click="sortBy('code')" role="button">物性コード</td>
                    <td :class="orderBy('name')" @click="sortBy('name')" role="button">物性名</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="physpropName in paginatedData" :key="physpropName.code">
                    <td class="text-start">{{ physpropName.code }}</td>
                    <td class="text-start">{{ physpropName.name }}</td>
                    <td class="text-start">{{ formatAt(physpropName.createdAt) }}</td>
                    <td class="text-start">{{ physpropName.createdBy }}</td>
                    <td class="text-start">{{ formatAt(physpropName.updatedAt) }}</td>
                    <td class="text-start">{{ physpropName.updatedBy }}</td>
                    <td class="text-start">
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="updatePhyspropName(physpropName)">編集</button>
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="removePhyspropName(physpropName)">削除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <Pagination
            v-model:page="page"
            :pageLength="pageLength"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { useFilter } from '@/composables/useFilterWithQuery';
import { useSort } from '@/composables/useSortWithQuery';
import { usePagination } from '@/composables/usePaginationWithQuery';
import { formatDate, formatAt } from '@/utils/formatDateTime';
import { Message, Pagination } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { addToast } = useToast();
const { confirm } = useConfirm();

const physpropNames = ref([]);
const { keyword, filteredData } = useFilter(physpropNames);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

onMounted(() => {
    fetchPhyspropNames();
});

const fetchPhyspropNames = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/physprop/names`);
        physpropNames.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const addPhyspropName = () => {
    router.push({
        name: 'PhyspropNameAdd',
        state: {
            routeQuery: route.query,
        },
    });
};

const updatePhyspropName = ({ code }) => {
    router.push({
        name: 'PhyspropNameEdit',
        params: { code },
        state: {
            routeQuery: route.query,
        },
    });
};

const removePhyspropName = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/physprop/names/${code}`);
        addToast('削除しました。', 'success');
        await fetchPhyspropNames();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>