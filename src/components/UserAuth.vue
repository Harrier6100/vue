<template>
    <template v-if="isAuth">
        <div class="text-white" role="button">
            <div class="position-relative">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
            </div>

            <router-link class="text-white" to="/setting">
                <i class="bi bi-gear"></i>
            </router-link>
        </div>
    </template>

    <template v-else>
        <div class="text-white" role="button" @click="modalLogin.open">
            <i class="bi bi-person-circle me-1"></i>ログイン
        </div>
    </template>

    <LoginModal v-if="modalLogin.isOpen.value"
        :isOpen="modalLogin.isOpen.value"
        @close="modalLogin.close"
    />
</template>

<script setup>
import { useModal } from '@/composables/useModal';
import { useAuth } from '@/composables/useAuth';
import { LoginModal } from '@/components';

const { isAuth, authLogout } = useAuth();
const modalLogin = useModal();
</script>