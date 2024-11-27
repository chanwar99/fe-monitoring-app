<template>
    <div class="drawer-side z-20">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 min-h-full">
            <li><router-link to="/" @click="closeDrawer">Home</router-link></li>
            <li><router-link to="/laporan-user" @click="closeDrawer">Laporan User</router-link></li>

        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const detailsElement = ref(null);

const closeDrawer = () => {
    const drawer = document.getElementById('my-drawer');
    if (drawer) {
        drawer.checked = false; // Uncheck the drawer to close it
    }

    // Close the <details> element
    if (detailsElement.value && detailsElement.value.open) {
        detailsElement.value.open = false;
    }
};

// Close the drawer and collapse on route change
const router = useRouter();
router.afterEach(() => {
    closeDrawer();
});

</script>
