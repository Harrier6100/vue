<template>
    <div class="container-fluid">
        <div class="mb-3">
            <router-link class="text-dark text-decoration-none" to="/setting/profile">
                <i class="bi bi-arrow-left me-1"></i>プロフィール
            </router-link>
        </div>
        <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                
                <form @submit.prevent="save" autocomplete="off">
                    <div class="mb-3">
                        <label class="form-label" for="name">名前</label>
                        <input class="form-control" type="text" id="name" v-model="setting.name">
                        <Message :error="errorMessage.name" />
                    </div>
                    
                    <div class="d-grid">
                        <button class="btn btn-primary" type="submit" :disabled="isLoading || isChange">
                            <span v-if="isAsyncLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { useUser } from '@/composables/useUser';
import { Message } from '@/components';

const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();
const { user, fetchUser } = useUser();

const settingRestore = () => ({
    name: '',
});
const setting = ref(settingRestore());

onMounted(() => {
    setting.value.name = user.value.name;
});

const isChange = computed(() => {
    return setting.value.name === user.value.name;
});

const validate = () => {
    let isValid = true;

    errorMessage.value.name = '';
    if (!setting.value.name) {
        errorMessage.value.name = '名前を入力してください。';
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
        await execute(async () => {
            await api.put(`/api/auth/me/name`, setting.value);
        });
        addToast('保存しました。', 'success');
        await fetchUser();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>