<template>
    <div class="container-fluid">
        <div class="mb-3">物性規格</div>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" type="text" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" type="button" @click="addPhyspropSpec">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('productCode')" @click="sortBy('productCode')" role="button">品名コード</td>
                    <td :class="orderBy('productName')" @click="sortBy('productName')" role="button">品名</td>
                    <td :class="orderBy('customerCode')" @click="sortBy('customerCode')" role="button">得意先コード</td>
                    <td :class="orderBy('customerName')" @click="sortBy('customerName')" role="button">得意先名</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="physpropSpec in paginatedData" :key="`${physpropSpec.productCode}-${physpropSpec.customerCode}`">
                    <td class="text-start">{{ physpropSpec.productCode }}</td>
                    <td class="text-start">{{ physpropSpec.productName }}</td>
                    <td class="text-start">{{ physpropSpec.customerCode }}</td>
                    <td class="text-start">{{ physpropSpec.customerName }}</td>
                    <td class="text-start">{{ formatAt(physpropSpec.createdAt) }}</td>
                    <td class="text-start">{{ physpropSpec.createdBy }}</td>
                    <td class="text-start">{{ formatAt(physpropSpec.updatedAt) }}</td>
                    <td class="text-start">{{ physpropSpec.updatedBy }}</td>
                    <td class="text-start">
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="updatePhyspropSpec(physpropSpec)">編集</button>
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="removePhyspropSpec(physpropSpec)">削除</button>
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
import { Pagination } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { addToast } = useToast();
const { confirm } = useConfirm();

const physpropSpecs = ref([]);
const { keyword, filteredData } = useFilter(physpropSpecs);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

onMounted(() => {
    fetchPhyspropSpecs();
});

const fetchPhyspropSpecs = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/physprop/specs`);
        physpropSpecs.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const addPhyspropSpec = () => {
    router.push({
        name: 'PhyspropSpecAdd',
        state: {
            routeQuery: route.query,
        },
    });
};

const updatePhyspropSpec = ({ productCode, customerCode }) => {
    router.push({
        name: 'PhyspropSpecEdit',
        params: {
            productCode,
            customerCode,
        },
        state: {
            routeQuery: route.query,
        },
    });
};

const removePhyspropSpec = async ({ productCode, customerCode }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/physprop/specs/${productCode}/${customerCode ?? ''}`);
        addToast('削除しました。', 'success');
        await fetchPhyspropSpecs();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>