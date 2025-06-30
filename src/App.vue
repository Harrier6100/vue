<template>
    <Navbar />
    <main>
        <router-view />
    </main>
    <Confirm />
    <Toast />
</template>

<script setup>
import { Navbar, Confirm, Toast } from '@/components';
</script>