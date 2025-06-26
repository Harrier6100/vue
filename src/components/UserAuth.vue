<template>
    <template v-if="isAuth">
        <div class="d-flex justify-content-end gap-3">
            <div class="text-white" role="button">
                <div class="position-relative">
                    <i class="bi bi-bell"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
                </div>
            </div>
            <router-link class="text-white" to="/setting">
                <i class="bi bi-gear"></i>
            </router-link>
            <div class="text-white" role="button" @click="logout">
                <i class="bi bi-person-circle me-1"></i>{{ userName }}
            </div>
        </div>
    </template>
    <template v-else>
        <div class="text-white" role="button" @click="loginForm.open">ログイン</div>
    </template>
    
    <LoginForm v-if="loginForm.isOpen.value"
        :isOpen="loginForm.isOpen.value"
        @close="loginForm.close"
    />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { useModal } from '@/composables/useModal';
import { useAuth } from '@/composables/useAuth';
import { useUser } from '@/composables/useUser';
import { LoginForm } from '@/components';

const router = useRouter();
const { confirm } = useConfirm();
const { addToast } = useToast();
const { isAuth, authLogout } = useAuth();
const { userName } = useUser();
const loginForm = useModal();

const logout = async () => {
    const isConfirmed = await confirm('ログアウトしますか？');
    if (!isConfirmed) return;

    await authLogout();
    addToast('ログアウトしました。', 'success');
    router.push('/');
};
</script>