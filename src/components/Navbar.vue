<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
        <div class="container-fluid">
            <div class="me-3" type="button" @click="sidebar.open">
                <span class="navbar-toggler-icon"></span>
            </div>
            <div class="me-auto">
                <router-link class="navbar-brand" to="/">Brand</router-link>
            </div>
            <UserAuth />
        </div>
    </nav>
    <Sidebar v-if="sidebar.isOpen.value"
        :isOpen="sidebar.isOpen.value"
        @close="sidebar.close"
    />
</template>

<script setup>
import { useModal } from '@/composables/useModal';
import { Sidebar, UserAuth } from '@/components';
const sidebar = useModal();
</script>