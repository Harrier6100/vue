<template>
    <main>
        <Navbar />
        <router-view />
    </main>
    <Confirm />
</template>

<script setup>
import { Navbar, Confirm } from '@/components';
</script>