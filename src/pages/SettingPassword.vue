<template>
    <div class="container-fluid">
        <div class="mb-3">
            <router-link class="text-dark text-decoration-none" to="/setting">
                <i class="bi bi-arrow-left me-1"></i>設定
            </router-link>
        </div>
        <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                <form @submit.prevent="save" autocomplete="off">

                    <div class="mb-3">
                        <label class="form-label" for="password">新しいパスワード</label>
                        <input class="form-control" type="password" id="password" v-model="setting.password">
                        <Message :error="errorMessage.password" />
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label" for="passwordConfirm">新しいパスワード確認</label>
                        <input class="form-control" type="password" id="passwordConfirm" v-model="setting.passwordConfirm">
                        <Message :error="errorMessage.passwordConfirm" />
                    </div>
                    
                    <div class="d-grid">
                        <button class="btn btn-primary" type="submit" :disabled="isLoading">
                            <span v-if="isAsyncLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>保存
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { Message } from '@/components';

const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();

const settingRestore = () => ({
    password: '',
    passwordConfirm: '',
});
const setting = ref(settingRestore());

const validate = () => {
    let isValid = true;

    errorMessage.value.password = '';
    if (!setting.value.password) {
        errorMessage.value.password = '新しいパスワードを入力してください。';
        isValid = false;
    }

    errorMessage.value.passwordConfirm = '';
    if (!setting.value.passwordConfirm) {
        errorMessage.value.passwordConfirm = '新しいパスワードを入力してください。';
        isValid = false;
    } else if (setting.value.password !== setting.value.passwordConfirm) {
        errorMessage.value.passwordConfirm = '新しいパスワードが一致しません。';
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
            await api.put(`/api/auth/me/password`, setting.value);
        });
        addToast('保存しました。', 'success');
        setting.value = settingRestore();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};
</script>