<template>
    <div class="container-fluid">
        <div class="mb-3">物性名</div>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" type="text" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" type="button" @click="addPhysprop">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('code')" @click="sortBy('code')" role="button">物性コード</td>
                    <td :class="orderBy('name')" @click="sortBy('name')" role="button">物性名</td>
                    <td :class="orderBy('uom')" @click="sortBy('uom')" role="button">単位</td>
                    <td :class="orderBy('si_uom')" @click="sortBy('si_uom')" role="button">SI単位</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="physprop in paginatedData" :key="physprop.code">
                    <td class="text-start">{{ physprop.code }}</td>
                    <td class="text-start">{{ physprop.name }}</td>
                    <td class="text-start">{{ physprop.uom }}</td>
                    <td class="text-start">{{ physprop.si_uom }}</td>
                    <td class="text-start">{{ formatAt(physprop.createdAt) }}</td>
                    <td class="text-start">{{ physprop.createdBy }}</td>
                    <td class="text-start">{{ formatAt(physprop.updatedAt) }}</td>
                    <td class="text-start">{{ physprop.updatedBy }}</td>
                    <td class="text-start">
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="updatePhysprop(physprop)">編集</button>
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="removePhysprop(physprop)">削除</button>
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

const physprops = ref([]);
const { keyword, filteredData } = useFilter(physprops);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

onMounted(() => {
    fetchPhysprops();
});

const fetchPhysprops = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/physprops`);
        physprops.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const addPhysprop = () => {
    router.push({
        name: 'PhyspropAdd',
        state: {
            routeQuery: route.query,
        },
    });
};

const updatePhysprop = ({ code }) => {
    router.push({
        name: 'PhyspropEdit',
        params: { code },
        state: {
            routeQuery: route.query,
        },
    });
};

const removePhysprop = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/physprops/${code}`);
        addToast('削除しました。', 'success');
        await fetchPhysprops();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>