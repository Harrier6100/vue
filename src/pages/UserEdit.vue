<template>
    <div class="container-fluid">
        <div class="mb-3">アカウント</div>

        <form @submit.prevent="save" autocomplete="off">

            <div class="mb-3">
                <label class="form-label" for="code">ID</label>
                <input class="form-control" type="text" id="code" v-model="user.code" :readonly="!!code">
                <Message :error="errorMessage.code" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="name">名前</label>
                <input class="form-control" type="text" id="name" v-model="user.name">
                <Message :error="errorMessage.name" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="role">役割</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="admin" value="admin" v-model="user.role">
                    <label class="form-check-label" for="admin">Admin</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="user" value="user" v-model="user.role">
                    <label class="form-check-label" for="user">User</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" id="guest" value="guest" v-model="user.role">
                    <label class="form-check-label" for="guest">Guest</label>
                </div>
            </div>

            <div class="mb-3" v-if="user.role === 'guest'">
                <label class="form-label" for="expiryDate">有効期限</label>
                <DatePicker class="form-control" id="expiryDate" v-model="user.expiryDate" placeholder="YYYY-MM-DD" />
                <Message :error="errorMessage.expiryDate" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="remarks">備考</label>
                <textarea class="form-control" id="remarks" v-model="user.remarks"></textarea>
            </div>

            <div class="mb-3">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="isActive" v-model="user.isActive">
                    <label class="form-check-label" for="isActive">{{ user.isActive ? '有効' : '無効' }}</label>
                </div>
            </div>

            <SaveButtons
                :isLoading="isLoading"
                :isAsyncLoading="isAsyncLoading"
                @cancel="cancel"
            />

        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { Message, SaveButtons, DatePicker } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();

const { code } = route.params;
const userRestore = () => ({
    code: '',
    name: '',
    role: 'user',
    expiryDate: '',
    remarks: '',
    isActive: true,
});
const user = ref(userRestore());

onMounted(async () => {
    if (code) {
        try {
            startLoading();
            const response = await api.get(`/api/users/${code}`);
            user.value.code = response.data.code;
            user.value.name = response.data.name;
            user.value.role = response.data.role;
            user.value.expiryDate = response.data.expiryDate;
            user.value.remarks = response.data.remarks;
            user.value.isActive = response.data.isActive;
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            stopLoading();
        }
    }
});

watch(() => user.value.role, (newValue) => {
    if (newValue !== 'guest') {
        user.value.expiryDate = '';
    }
});

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!user.value.code) {
        errorMessage.value.code = 'IDを入力してください。';
        isValid = false;
    }

    errorMessage.value.name = '';
    if (!user.value.name) {
        errorMessage.value.name = '名前を入力してください。';
        isValid = false;
    }

    errorMessage.value.expiryDate = '';
    if (user.value.role === 'guest' && !user.value.expiryDate) {
        errorMessage.value.expiryDate = '有効期限を設定してください。';
        isValid = false;
    }

    return isValid;
};

const save = async () => {
    if (!validate()) {
        addToast('入力内容に誤りがあります。', 'error');
        return;
    }

    try {
        startLoading();
        if (code) {
            await execute(async () => {
                await api.put(`/api/users/${code}`, user.value);
            });
            addToast('保存しました。', 'success');
        } else {
            await execute(async () => {
                await api.post(`/api/users`, user.value);
            });
            addToast('保存しました。', 'success');
            user.value = userRestore();
        }
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const cancel = () => {
    const { routeQuery } = window.history.state || {};
    router.push({
        name: 'UserList',
        query: routeQuery,
    });
};
</script>