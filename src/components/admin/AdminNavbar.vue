<!-- <template>
    <nav class="bg-gray-900 p-4 text-white">
        <ul class="flex space-x-4">
            <li><router-link to="/admin/dashboard" class="hover:text-gray-300">Dashboard</router-link></li>
            <li><router-link to="/admin/manage-books" class="hover:text-gray-300">Manage Books</router-link></li>
            <li><router-link to="/" class="hover:text-gray-300">User Site</router-link></li>
        </ul>
    </nav>
</template> -->

<template>
    <div class="navbar fixed top-0 left-0 w-full bg-gray-800 z-10">
        <div class="navbar-start">
            <div class="flex-none lg:hidden">
                <label for="my-drawer" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </label>
            </div>
            <a class="btn btn-ghost text-xl">Admin</a>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal space-x-1">
                <li><router-link :to="{ name: 'Dashboard' }">Dashboard</router-link></li>
                <li><router-link :to="{ name: 'AdminReport' }">Verifikasi Laporan</router-link></li>

            </ul>

        </div>

        <div class="navbar-end">
            <AccountMenu />
        </div>
    </div>
</template>

<script setup>
import AccountMenu from '@/components/common/AccountMenu.vue';
</script>

<style scoped>
.navbar {
    height: 65px;
}
</style>