<template>
    <div class="container-fluid">
        <div class="mb-3">アカウント</div>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" type="text" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" type="button" @click="addUser">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('code')" @click="sortBy('code')" role="button">ID</td>
                    <td :class="orderBy('name')" @click="sortBy('name')" role="button">名前</td>
                    <td :class="orderBy('email')" @click="sortBy('email')" role="button">メールアドレス</td>
                    <td :class="orderBy('role')" @click="sortBy('role')" role="button">役割</td>
                    <td :class="orderBy('expiryDate')" @click="sortBy('expiryDate')" role="button">有効期限</td>
                    <td :class="orderBy('isActive')" @click="sortBy('isActive')" role="button">状態</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedData" :key="user.code">
                    <td class="text-start">{{ user.code }}</td>
                    <td class="text-start">{{ user.name }}</td>
                    <td class="text-start">{{ user.email }}</td>
                    <td class="text-start">{{ user.role }}</td>
                    <td class="text-start">{{ formatDate(user.expiryDate) }}</td>
                    <td class="text-start">{{ user.isActive ? '有効' : '無効' }}</td>
                    <td class="text-start">{{ formatAt(user.createdAt) }}</td>
                    <td class="text-start">{{ user.createdBy }}</td>
                    <td class="text-start">{{ formatAt(user.updatedAt) }}</td>
                    <td class="text-start">{{ user.updatedBy }}</td>
                    <td class="text-start">
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="updateUser(user)">編集</button>
                            <button class="btn btn-link text-dark text-decoration-none p-0" type="button" @click="removeUser(user)">削除</button>
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

const users = ref([]);
const { keyword, filteredData } = useFilter(users);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/users`);
        users.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const addUser = () => {
    router.push({
        name: 'UserAdd',
        state: {
            routeQuery: route.query,
        },
    });
};

const updateUser = ({ code }) => {
    router.push({
        name: 'UserEdit',
        params: { code },
        state: {
            routeQuery: route.query,
        },
    });
};

const removeUser = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/users/${code}`);
        addToast('削除しました。', 'success');
        await fetchUsers();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>