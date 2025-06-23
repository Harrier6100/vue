<template>
    <main>
        <Navbar />
        <router-view />
    </main>
    <Confirm />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Confirm from '@/components/Confirm.vue';
</script>