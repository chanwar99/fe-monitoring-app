<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Laporan Penyaluran Bantuan</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- List of Reports -->
            <div>
                <h3 class="text-2xl font-bold mb-4">Daftar Laporan</h3>
                <ul class="space-y-2">
                    <li v-if="loading" class="space-y-2">
                        <div v-for="n in 5" :key="n" class="animate-pulse">
                            <div class="flex space-x-4">
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-gray-800 rounded"></div>
                                    <div class="h-4 bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li v-else-if="reports.length === 0 && !loading" class="py-2">
                        <p>No reports available.</p>
                    </li>
                    <li v-else v-for="report in reports" :key="report.id"
                        class="border-b border-gray-500 py-2 flex items-start">
                        <div class="flex-1">
                            <h1 class="text-xl font-bold">{{ report.program.name }}</h1>
                            <p><b>Wilayah:</b> {{ report.provinsi }}, {{ report.kabupaten }}, {{ report.kecamatan }}</p>
                            <p><b>Jumlah Penerima:</b> {{ report.jumlah_penerima }}</p>
                            <p><b>Status:</b> {{ report.status }}</p>
                            <p v-if="report.status == 'ditolak'"><b>Alasan Penolakan:</b> {{ report.alasan_penolakan }}
                            </p>
                            <div class="flex" v-if="report.status == 'pending'">
                                <button @click="editReport(report.id)" class="text-blue-500 mr-2">Edit</button>
                                <button @click="deleteReport(report.id)" class="text-red-500">Delete</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- CRUD Form -->
            <div ref="formSection">
                <div class="p-4 bg-gray-800 rounded-md">
                    <h3 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Laporan' : 'Tambah Laporan' }}</h3>
                    <form @submit.prevent="isEditMode ? updateReport() : addReport()" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Program Bantuan</span>
                            </label>
                            <select v-model="form.program_id" class="select select-bordered w-full">
                                <option v-for="program in programs" :key="program.id" :value="program.id">
                                    {{ program.name }}
                                </option>
                            </select>
                            <span v-if="errors.program_id" class="text-red-500 text-sm">{{ errors.program_id[0]
                                }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Provinsi</span>
                            </label>
                            <select v-model="form.provinsi" @change="fetchKabupaten"
                                class="select select-bordered w-full">
                                <option value="">Pilih Provinsi</option>
                                <option v-for="prov in provinsiList" :key="prov.name" :value="prov.name">
                                    {{ prov.name }}
                                </option>
                            </select>
                            <span v-if="errors.provinsi" class="text-red-500 text-sm">{{ errors.provinsi[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Kabupaten/Kota</span>
                            </label>
                            <select v-model="form.kabupaten" @change="fetchKecamatan"
                                class="select select-bordered w-full" :disabled="!form.provinsi">
                                <option value="">Pilih Kabupaten/Kota</option>
                                <option v-for="kab in kabupatenList" :key="kab.name" :value="kab.name">
                                    {{ kab.name }}
                                </option>
                            </select>
                            <span v-if="errors.kabupaten" class="text-red-500 text-sm">{{ errors.kabupaten[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Kecamatan</span>
                            </label>
                            <select v-model="form.kecamatan" class="select select-bordered w-full"
                                :disabled="!form.kabupaten">
                                <option value="">Pilih Kecamatan</option>
                                <option v-for="kec in kecamatanList" :key="kec.name" :value="kec.name">
                                    {{ kec.name }}
                                </option>
                            </select>
                            <span v-if="errors.kecamatan" class="text-red-500 text-sm">{{ errors.kecamatan[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Jumlah Penerima</span>
                            </label>
                            <input v-model="form.jumlah_penerima" type="number" class="input input-bordered w-full" />
                            <span v-if="errors.jumlah_penerima" class="text-red-500 text-sm">{{
                                errors.jumlah_penerima[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Tanggal Penyaluran</span>
                            </label>
                            <input v-model="form.tanggal_penyaluran" type="date" class="input input-bordered w-full" />
                            <span v-if="errors.tanggal_penyaluran" class="text-red-500 text-sm">{{
                                errors.tanggal_penyaluran[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Bukti Penyaluran</span>
                            </label>
                            <input ref="fileInput" @change="handleFileChange" type="file"
                                class="file-input file-input-bordered w-full"
                                accept="image/png, image/gif, image/jpeg" />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Catatan Tambahan</span>
                            </label>
                            <textarea class="input input-bordered w-full" rows="2"
                                v-model="form.catatan_tambahan"></textarea>
                        </div>
                        <div class="space-x-2">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                {{ (isEditMode ? 'Update' : 'Tambah') + ' Laporan' }}
                            </button>
                            <button v-if="isEditMode" @click="resetForm" type="button"
                                class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import { useProgramStore } from '@/stores/programStore';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';

const { notify } = useNotification();

const reportStore = useReportStore();
const programStore = useProgramStore();
const formSection = ref(null);

const isEditMode = ref(false);
const form = ref({
    id: null,
    program_id: null,
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    jumlah_penerima: 0,
});

const handleFileChange = (event) => {
    form.value.bukti_penyaluran = event.target.files[0];
};

const programs = ref([]);
const reports = ref([]);
const loading = ref(false);
const errors = ref({});
const fileInput = ref(null);

const fetchPrograms = async () => {
    await programStore.fetchPrograms();
    programs.value = programStore.programs;
};

const fetchReports = async () => {
    loading.value = true;
    NProgress.start();
    try {
        await reportStore.fetchReports();
        reports.value = reportStore.reports;
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

const resetForm = () => {
    form.value = {
        id: null,
        program_id: null,
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        jumlah_penerima: 0,
    };
    fileInput.value.value = '';
    isEditMode.value = false;
};

const addReport = async () => {
    try {
        NProgress.start();
        await reportStore.addReport(form.value);
        await fetchReports();
        notify({ title: 'Success', text: 'Laporan berhasil ditambahkan', type: 'success' });
        resetForm();
        scrollToForm();
    } catch (err) {
        errors.value = reportStore.errors;
        console.log(reportStore.errors);
    } finally {
        NProgress.done();
    }
};

const editReport = async (id) => {
    try {
        await reportStore.fetchReportById(id);
        form.value = { ...reportStore.report };
        isEditMode.value = true;
        scrollToForm();  // Scroll to the form section

        console.log(form.value);
    } catch (err) {
        console.error(err);
    }
};

const updateReport = async () => {
    try {
        NProgress.start();
        const response = await reportStore.updateReport(form.value.id, form.value);
        await fetchReports();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
        resetForm();
        scrollToForm();
    } catch (err) {
        errors.value = reportStore.errors;
    } finally {
        NProgress.done();
    }
};

const scrollToForm = () => {
    const offset = -80; // Height of the fixed navbar
    const formPosition = formSection.value.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: formPosition, behavior: 'smooth' });
};

const deleteReport = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
        try {
            const response = await reportStore.deleteReport(id);
            notify({
                title: 'Success',
                text: response.message,
                type: 'success',
                group: 'default',
                duration: 3000,
                // Tailwind & Daisy UI
            });
            await fetchReports();
            resetForm();
            scrollToForm();
        } catch (err) {
            console.error(err);
        } finally {
            NProgress.done();
        }
    }
};

onMounted(() => {
    fetchPrograms();
    fetchReports();
});


watch(() => reportStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => reportStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});

import axios from 'axios';
const provinsiList = ref([]);
const kabupatenList = ref([]);
const kecamatanList = ref([]);


const fetchProvinsi = async () => {
    try {
        const { data } = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        provinsiList.value = data.map((provinsi) => ({
            id: provinsi.id,
            name: provinsi.name,
        }));
    } catch (error) {
        console.error('Failed to fetch provinsi:', error);
    }
};

const fetchKabupaten = async () => {
    if (!form.value.provinsi) return;
    try {
        const provinsi = provinsiList.value.find((item) => item.name === form.value.provinsi);
        const { data } = await axios.get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsi.id}.json`
        );
        kabupatenList.value = data.map((kabupaten) => ({
            id: kabupaten.id,
            name: kabupaten.name,
        }));
        kecamatanList.value = []; // Reset kecamatan when provinsi changes
        form.value.kabupaten = '';
        form.value.kecamatan = '';
    } catch (error) {
        console.error('Failed to fetch kabupaten:', error);
    }
};

const fetchKecamatan = async () => {
    if (!form.value.kabupaten) return;
    try {
        const kabupaten = kabupatenList.value.find((item) => item.name === form.value.kabupaten);
        const { data } = await axios.get(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabupaten.id}.json`
        );
        kecamatanList.value = data.map((kecamatan) => ({
            id: kecamatan.id,
            name: kecamatan.name,
        }));
        form.value.kecamatan = '';
    } catch (error) {
        console.error('Failed to fetch kecamatan:', error);
    }
};

onMounted(() => {
    fetchProvinsi();

});

</script>
