<template>
    <Navbar />
    <main>
        <router-view />
    </main>
    <Toast />
    <Confirm />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Toast from '@/components/Toast.vue';
import Confirm from '@/components/Confirm.vue';
</script>