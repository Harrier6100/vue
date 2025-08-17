<template>
    <div class="container-fluid">
        <h6 class="mb-3">アカウント管理</h6>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" @click="handleCreate">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th @click="sortBy('code')" role="button">
                        アカウント
                        <span v-if="orderBy('code').asc">↑</span>
                        <span v-else-if="orderBy('code').desc">↓</span>
                    </th>
                    <th @click="sortBy('name')" role="button">
                        名前
                        <span v-if="orderBy('name').asc">↑</span>
                        <span v-else-if="orderBy('name').desc">↓</span>
                    </th>
                    <th @click="sortBy('role')" role="button">
                        ロール
                        <span v-if="orderBy('role').asc">↑</span>
                        <span v-else-if="orderBy('role').desc">↓</span>
                    </th>
                    <th @click="sortBy('expiryDate')" role="button">
                        有効期限
                        <span v-if="orderBy('expiryDate').asc">↑</span>
                        <span v-else-if="orderBy('expiryDate').desc">↓</span>
                    </th>
                    <th @click="sortBy('isActive')" role="button">
                        状態
                        <span v-if="orderBy('isActive').asc">↑</span>
                        <span v-else-if="orderBy('isActive').desc">↓</span>
                    </th>
                    <th :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">
                        作成日時
                        <span v-if="orderBy('createdAt').asc">↑</span>
                        <span v-else-if="orderBy('createdAt').desc">↓</span>
                    </th>
                    <th :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">
                        作成者
                        <span v-if="orderBy('createdBy').asc">↑</span>
                        <span v-else-if="orderBy('createdBy').desc">↓</span>
                    </th>
                    <th :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">
                        更新日時
                        <span v-if="orderBy('updatedAt').asc">↑</span>
                        <span v-else-if="orderBy('updatedAt').desc">↓</span>
                    </th>
                    <th :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">
                        更新者
                        <span v-if="orderBy('updatedBy').asc">↑</span>
                        <span v-else-if="orderBy('updatedBy').desc">↓</span>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedData" :key="user.code">
                    <td>{{ user.code }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ roleLabel(user.role) }}</td>
                    <td>{{ formatDate(user.expiryDate) }}</td>
                    <td>{{ user.isActive ? '有効' : '無効' }}</td>
                    <td>{{ formatAt(user.createdAt) }}</td>
                    <td>{{ user.createdBy }}</td>
                    <td>{{ formatAt(user.updatedAt) }}</td>
                    <td>{{ user.updatedBy }}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-3">
                            <button v-if="hasPermission('users:update')" class="btn btn-link text-decoration-none p-0" @click="handleUpdate(user)">編集</button>
                            <button v-if="hasPermission('users:remove')" class="btn btn-link text-decoration-none p-0" @click="handleRemove(user)">削除</button>
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
import { formatDate, formatAt } from '@/utils/formatDateTime';
import { api } from '@/libs/api';
import { useRouterState } from '@/composables/useRouterState';
import { useUser } from '@/composables/useUser';
import { useLoading } from '@/composables/useLoading';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { useDataTable } from '@/composables/useDataTableQuery';
import Pagination from '@/components/Pagination.vue';

const route = useRoute();
const router = useRouter();
const routerState = useRouterState();
const { hasPermission } = useUser();
const { startLoading, stopLoading } = useLoading();
const { addToast } = useToast();
const { confirm } = useConfirm();

const roleMap = {
    admin: 'Admin',
    user: 'User',
    guest: 'Guest',
};
const users = ref([]);
const { keyword, page, pageLength, paginatedData, sortBy, orderBy } = useDataTable(users, 10);

const roleLabel = (role) => {
    return roleMap[role] ?? '';
};

const fetchUsers = async () => {
    try {
        startLoading();
        const response = await api.get('/api/users');
        users.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const handleCreate = () => {
    routerState.setState({ ...route.query });
    router.push({
        name: 'UserCreate',
    });
};

const handleUpdate = ({ code }) => {
    routerState.setState({ ...route.query });
    router.push({
        name: 'UserUpdate',
        params: { code },
    });
};

const handleRemove = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/users/${code}`);
        addToast('削除しました。', 'success');
        fetchUsers();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

onMounted(() => {
    fetchUsers();
});
</script>