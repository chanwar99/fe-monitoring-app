<template>
    <div class="drawer drawer-mobile">
        <Navbar />
        <input id="my-drawer" type="checkbox" class="drawer-toggle">
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <main class="min-h-screen">
                <router-view />
            </main>
        </div>
        <!-- Drawer -->
        <Drawer />
    </div>
    <Footer />


</template>

<script setup>
import Navbar from '@/components/user/Navbar.vue';
import Footer from '@/components/user/Footer.vue';
import Drawer from '@/components/user/Drawer.vue';
</script>

<style>
main {
    padding-top: 65px;
}
</style>