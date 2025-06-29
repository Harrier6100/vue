<template>
    <div class="d-flex flex-column vh-100">
        <Navbar />
        <!-- <div class="modal-backdrop show"></div>
        <div class="offcanvas offcanvas-start show">
            <div class="offcanvas-header">
                aaa
            </div>
            <div class="offcanvas-body">
                trest
            </div>
        </div> -->
        <!-- <div class="container-fluid flex-grow-1">
            <div class="row h-100">
                <div class="col-2 border-end p-3">
                    <Sidebar />
                </div>
                <div class="col">
                </main>
            </div>
        </div>
    </div> -->
        <main class="p-3">
            <router-view />
        </main>
        <Confirm />
        <Toast />
    </div>

    <!-- <div class="d-flex flex-column vh-100">
        <Navbar />
        <div class="d-flex flex-grow-1">
            <Sidebar />
            <main class="flex-grow-1 overflow-auto p-3">
                <router-view />
            </main>
        </div>
    </div> -->

    <!-- <main>
        <Navbar />
        <Sidebar>
            <router-view />
        </Sidebar>
    </main>
    <Confirm />
    <Toast /> -->
</template>

<script setup>
import { Navbar, Confirm, Toast } from '@/components';
</script>