<template>
    <div class="container-fluid">
        <h6>アカウント</h6>

        <div class="d-flex justify-content-between gap-3">
            <input class="form-control w-25" type="text" v-model="keyword" placeholder="検索">
            <button class="btn btn-primary" type="button" @click="addUser">新規作成</button>
        </div>

        <table class="table table-hover">
            <thead>
            </thead>
            <tbody>
                <tr v-for="user in filteredData" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-link text-decoration-none p-0" type="button" @click="removeUser(user.id)">削除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <Toast v-if="toasts.length"
        :toasts="toasts"
        @close="removeToast"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { useFilter } from '@/composables/useFilterWithQuery';

const { isLoading, startLoading, stopLoading } = useLoading();
const { toasts, addToast, removeToast } = useToast();
const { confirm } = useConfirm();

const users = ref([]);
const { keyword, filteredData } = useFilter(users);

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

const removeUser = async (id) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/users/${id}`);
        addToast('削除しました。', 'success');
        await fetchUsers();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>

<route>
{
    name: 'users',
    meta: {
        requiresAuth: true
    }
}
</route>