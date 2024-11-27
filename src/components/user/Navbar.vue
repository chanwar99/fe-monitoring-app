<template>
    <div class="navbar fixed top-0 left-0 w-full bg-gray-800 z-10">
        <div class="navbar-start">
            <!-- Mobile Menu Toggle -->
            <div class="flex-none lg:hidden">
                <label for="my-drawer" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </label>
            </div>
            <!-- Brand Name -->
            <a class="btn btn-ghost text-xl">SME</a>
        </div>
        <!-- Desktop Menu -->
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal space-x-1">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/laporan-user">Laporan User</router-link></li>
            </ul>
        </div>
        <!-- Search and Account Menu -->
        <div class="navbar-end gap-2">
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
