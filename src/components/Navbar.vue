<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <button class="btn btn-primary" @click="sidebar.open">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="me-auto">
                <router-link class="navbar-brand" to="/">AppName</router-link>
            </div>
            <Authentication />
        </div>
    </nav>

    <Sidebar v-if="sidebar.isOpen.value"
        :isOpen="sidebar.isOpen.value"
        @close="sidebar.close"
    />
</template>

<script setup>
import { useToggle } from '@/composables/useToggle';
import Sidebar from '@/components/Sidebar.vue';
import Authentication from '@/components/Authentication.vue';

const sidebar = useToggle();
</script>