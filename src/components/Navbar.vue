<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">Brand</router-link>
            <div class="ms-auto">
                <UserAuth />
            </div>
        </div>
    </nav>
</template>

<script setup>
import { UserAuth } from '@/components';
</script>