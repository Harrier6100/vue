<template>
    <div class="container">
        <h6 class="mb-3">アカウント管理</h6>

        <form @submit.prevent="handleSubmit" autocomplete="off">

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="code">アカウント</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="code" v-model="user.code">
                    <Message :error="errors.code" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="name">名前</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="name" v-model="user.name">
                    <Message :error="errors.name" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="role">ロール</label>
                <div class="col-9">
                    <div v-for="role in roles" :key="role.value" class="form-check">
                        <input class="form-check-input" type="radio" :id="role.value" :value="role.value" v-model="user.role">
                        <label class="form-check-label" :for="role.value">{{ role.label }}</label>
                    </div>
                </div>
            </div>

            <div class="row mb-3" v-if="user.role === 'user'">
                <div class="col-9 offset-3">
                    <button class="btn btn-link text-decoration-none px-0" type="button" @click="permission.open">アクセス権限を設定</button>
                </div>
            </div>

            <div class="row mb-3" v-if="user.role === 'guest'">
                <label class="col-3 col-form-label" for="expiryDate">有効期限</label>
                <div class="col-9">
                    <DatePicker class="form-control" id="expiryDate" v-model="user.expiryDate" placeholder="YYYY-MM-DD" />
                    <Message :error="errors.expiryDate" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="remarks">備考</label>
                <div class="col-9">
                    <textarea class="form-control" id="remarks" v-model="user.remarks"></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-9 offset-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="isActive" v-model="user.isActive">
                        <label class="form-check-label" for="isActive">{{ user.isActive ? '有効なアカウント' : '無効なアカウント' }}</label>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end gap-3">
                <button class="btn btn-secondary" type="button" :disabled="isLoading" @click="handleCancel">キャンセル</button>
                <button class="btn btn-primary" type="submit" :disabled="isLoading">
                    <span v-if="isSpinning" class="spinner-border spinner-border-sm me-1"></span>保存
                </button>
            </div>

        </form>
    </div>

    <Permission v-if="permission.isOpen.value"
        :isOpen="permission.isOpen.value"
        :modelValue="user.permissions"
        @save="permissions => user.permissions = permissions"
        @close="permission.close"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/libs/api';
import { useRouterState } from '@/composables/useRouterState';
import { useLoading } from '@/composables/useLoading';
import { useSpinning } from '@/composables/useSpinning';
import { useToast } from '@/composables/useToast';
import { useToggle } from '@/composables/useToggle';
import Message from '@/components/Message.vue';
import DatePicker from '@/components/DatePicker.vue';
import Permission from '@/components/Permission.vue';

const route = useRoute();
const router = useRouter();
const routerState = useRouterState();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isSpinning, execute } = useSpinning();
const { addToast } = useToast();
const permission = useToggle();

const errors = ref({});
const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
];
const user = ref({
    code: '',
    name: '',
    role: 'user',
    permissions: [],
    expiryDate: '',
    remarks: '',
    isActive: true,
});

const isUpdateMode = computed(() => {
    return !!route.params.code;
});

watch(() => user.value.role, (value) => {
    if (value !== 'guest') {
        user.value.expiryDate = '';
    }
});

const fetchUser = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/users/${route.params.code}`);
        user.value = { ...user.value, ...response.data };
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const validate = () => {
    let isValid = true;

    errors.value.code = '';
    if (!user.value.code) {
        errors.value.code = 'アカウントを入力してください。';
        isValid = false;
    }

    errors.value.name = '';
    if (!user.value.name) {
        errors.value.name = '名前を入力してください。';
        isValid = false;
    }

    errors.value.expiryDate = '';
    if (user.value.role === 'guest' && !user.value.expiryDate) {
        errors.value.expiryDate = '有効期限を設定してください。';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validate()) return;

    try {
        startLoading();
        await execute(async () => {
            if (isUpdateMode.value) {
                await api.put(`/api/users/${route.params.code}`, user.value);
            } else {
                await api.post(`/api/users`, user.value);
            }
        });
        addToast('保存しました。', 'success');
        handleCancel();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const handleCancel = () => {
    const routeQuery = routerState.getState();
    router.push({
        name: 'UserList',
        query: routeQuery ?? {},
    });
};

onMounted(() => {
    if (isUpdateMode.value) {
        fetchUser();
    }
});
</script>