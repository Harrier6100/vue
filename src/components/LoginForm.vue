<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="close">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <Message class="mb-3" :error="errorMessage.error" />
                            <form @submit.prevent="login" autocomplete="off">
                                <div class="mb-3">
                                    <label class="form-label" for="code">ID</label>
                                    <input class="form-control" type="text" id="code" v-model="credentials.code">
                                    <Message :error="errorMessage.code" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="password">パスワード</label>
                                    <input class="form-control" type="password" id="password" v-model="credentials.password">
                                    <Message :error="errorMessage.password" />
                                </div>
                                <div class="d-grid">
                                    <button class="btn btn-primary" type="submit" :disabled="isLoading">
                                        <span v-if="isAsyncLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>ログイン
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useMessage } from '@/composables/useMessage';
import { useAuth } from '@/composables/useAuth';
import { Message } from '@/components';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { errorMessage } = useMessage();
const { authLogin } = useAuth();

const credentialsRestore = () => ({
    code: '',
    password: '',
});
const credentials = ref(credentialsRestore());

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!credentials.value.code) {
        errorMessage.value.code = 'IDを入力してください。';
        isValid = false;
    }

    errorMessage.value.password = '';
    if (!credentials.value.password) {
        errorMessage.value.password = 'パスワードを入力してください。';
        isValid = false;
    }

    return isValid;
};

const login = async () => {
    if (!validate()) return;

    try {
        startLoading();
        await execute(async () => {
            await authLogin(credentials.value);
        });
        emit('close');
        const redirectTo = sessionStorage.getItem('redirectTo');
        if (redirectTo) {
            sessionStorage.removeItem('redirectTo');
            router.push(redirectTo);
        }
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
};

const close = () => {
    emit('close');
};
</script>