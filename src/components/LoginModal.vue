<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="close">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <form @submit.prevent="login" autocomplete="off">

                                <div class="mb-3">
                                    <label class="form-label" for="id">アカウント</label>
                                    <input class="form-control" type="text" id="id" v-model="credentials.id">
                                    <Message :error="errorMessage.id" />
                                </div>

                                <div class="mb-3">
                                    <label class="form-label" for="password">パスワード</label>
                                    <input class="form-control" type="password" id="password" v-model="credentials.password">
                                    <Message :error="errorMessage.password" />
                                </div>

                                <div class="d-grid">
                                    <button class="btn btn-primary" type="submit" :disabled="isLoading">ログイン</button>
                                </div>

                                <Message :error="errorMessage.error" />
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
import { useMessage } from '@/composables/useMessage';
import { useAuth } from '@/composables/useAuth';
import { Message } from '@/components';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { errorMessage } = useMessage();
const { authLogin } = useAuth();
const isError = ref(false);

const credentialsRestore = () => ({
    id: '',
    password: '',
});
const credentials = ref(credentialsRestore());

const validate = () => {
    let isValid = true;

    errorMessage.value.id = '';
    if (!credentials.value.id) {
        errorMessage.value.id = 'アカウントを入力してください。';
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
    if (isError.value || !validate()) return;

    try {
        startLoading();
        await authLogin(credentials.value);
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