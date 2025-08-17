<template>
    <template v-if="isAuth">
        <button class="btn btn-primary">
            <div class="position-relative">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
            </div>
        </button>
        <button class="btn btn-primary">
            <router-link class="text-white" to="/setting">
                <i class="bi bi-gear"></i>
            </router-link>
        </button>
        <button class="btn btn-primary" @click="handleLogout">
            <i class="bi bi-person-circle me-1"></i>{{ name }}
        </button>
    </template>
    <template v-else>
        <button class="btn btn-primary" @click="login.open">ログイン</button>
    </template>

    <Login v-if="login.isOpen.value"
        :isOpen="login.isOpen.value"
        @close="login.close"
    />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useUser } from '@/composables/useUser';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { useToggle } from '@/composables/useToggle';
import Login from '@/components/Login.vue';

const router = useRouter();
const { isAuth, logout } = useAuth();
const { name } = useUser();
const { addToast } = useToast();
const { confirm } = useConfirm();
const login = useToggle();

const handleLogout = async () => {
    const isConfirmed = await confirm('ログアウトしますか？');
    if (!isConfirmed) return;

    try {
        await logout();
        router.push('/');
        addToast('ログアウトしました。', 'success');
    } catch (error) {
        addToast('ログアウトできませんでした。', 'error');
    }
};
</script>