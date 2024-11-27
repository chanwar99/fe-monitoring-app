<template>
    <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">Sistem Monitoring dan Evaluasi</h1>
                <p class="py-6">
                    Kementerian Sosial membangun Sistem Monitoring dan Evaluasi untuk program bantuan
                    sosial yang diberikan kepada masyarakat di seluruh Indonesia. Sistem ini digunakan oleh pemerintah
                    daerah untuk melaporkan penyaluran bantuan, memantau progres, serta menangani keluhan masyarakat
                </p>
                <router-link :to="{ name: 'ReportUser' }" class="btn btn-primary">Ayo Lapor!</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped></style>
