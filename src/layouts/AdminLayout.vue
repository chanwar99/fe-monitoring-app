<template>
    <div class="drawer drawer-mobile">
        <AdminNavbar />
        <input id="my-drawer" type="checkbox" class="drawer-toggle">
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <main class="min-h-screen">
                <router-view />
            </main>
        </div>
        <!-- Drawer -->
        <AdminDrawer />
    </div>
    <AdminFooter />


</template>

<script setup>
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminFooter from '@/components/admin/AdminFooter.vue';
import AdminDrawer from '@/components/admin/AdminDrawer.vue';
</script>

<style>
main {
    padding-top: 65px;
}
</style>