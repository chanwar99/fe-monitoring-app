<template>
    <div class="drawer-side z-20">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 min-h-full">
            <li> <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link></li>
            <li> <router-link :to="{ name: 'AdminReport' }">Verifikasi Laporan</router-link></li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const closeDrawer = () => {
    const drawer = document.getElementById('my-drawer');
    if (drawer) {
        drawer.checked = false; // Uncheck the drawer to close it
    }
};

const router = useRouter();
router.afterEach(() => {
    closeDrawer();
});
</script>
