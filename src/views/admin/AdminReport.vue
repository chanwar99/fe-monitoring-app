<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Verifikasi Laporan</h2>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <div>
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

                        <li v-else v-for="report in reports" class="border-b border-gray-500 py-2 flex items-start">
                            <div class="flex-1">
                                <h1 class="text-xl font-bold">{{ report.program.name }}</h1>
                                <p><b>Wilayah:</b> {{ report.provinsi }}, {{ report.kabupaten }}, {{ report.kecamatan }}
                                </p>
                                <p><b>Jumlah Penerima:</b> {{ report.jumlah_penerima }}</p>
                                <p><b>Status:</b> {{ report.status }}</p>
                                <p><b>Tanggal Penyaluran:</b> {{ report.tanggal_penyaluran || 'Belum Tersedia' }}</p>
                                <p v-if="report.catatan_tambahan"><b>Catatan Tambahan:</b> {{ report.catatan_tambahan }}
                                </p>
                                <div class="flex items-center space-x-2 mt-2">
                                    <button v-if="report.bukti_penyaluran"
                                        @click="downloadBuktiPenyaluran(report.bukti_penyaluran)"
                                        class="text-green-500 hover:underline">
                                        Unduh Bukti Penyaluran
                                    </button>
                                    <div v-if="report.status == 'pending'" class="flex">
                                        <button @click="approveReport(report.id)"
                                            class="text-blue-500 mr-2">Terima</button>
                                        <button @click="rejectReport(report.id)" class="text-red-500">Tolak</button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showRejectModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="p-4 bg-gray-800 rounded shadow-md w-full max-w-md">
            <h3 class="text-xl font-semibold mb-4">Masukkan Alasan Penolakan</h3>
            <textarea v-model="rejectReason" class="w-full p-2 border input input-bordered rounded"
                placeholder="Masukkan alasan penolakan" rows="4"></textarea>
            <div class="flex justify-end mt-4">
                <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2" @click="closeRejectModal">
                    Batal
                </button>
                <button class="bg-red-500 text-white px-4 py-2 rounded" @click="confirmReject">
                    Tolak
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useNotification } from '@kyvg/vue3-notification';
const { notify } = useNotification();

const reportStore = useReportStore();
const reports = ref([]);
const loading = ref(true); // Loading state

const showRejectModal = ref(false); // Modal state
const rejectReason = ref(''); // Alasan penolakan
const rejectReportId = ref(null); // ID laporan yang akan ditolak

// Fetch reports
const fetchAdminReports = async () => {
    loading.value = true;
    NProgress.start();
    try {
        await reportStore.fetchAdminReports();
        reports.value = reportStore.adminReports;
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

// Approve report
const approveReport = async (id) => {
    if (!confirm('Apakah Anda yakin menyetujui laporan ini?'))
        return

    NProgress.start();
    try {
        const response = await reportStore.approveReport(id);
        const report = reports.value.find((item) => item.id === id);
        if (report) report.status = 'diterima';
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
    } catch (error) {
        console.error('Failed to approve report:', error);
    } finally {

        NProgress.done();
    }
};

// Reject report - open modal
const rejectReport = (id) => {
    rejectReportId.value = id;
    showRejectModal.value = true;
};

// Close modal
const closeRejectModal = () => {
    showRejectModal.value = false;
    rejectReason.value = '';
};

// Confirm reject
const confirmReject = async () => {
    if (!rejectReason.value) {
        alert('Alasan penolakan wajib diisi!');
        return;
    }

    NProgress.start();
    try {
        const respons = await reportStore.rejectReport(rejectReportId.value, rejectReason.value);
        const report = reports.value.find((item) => item.id === rejectReportId.value);
        if (report) {
            report.status = 'ditolak';
            report.alasan_penolakan = rejectReason.value; // Tambahkan alasan penolakan ke report
        }

        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });

    } catch (error) {
        console.error('Failed to reject report:', error);
    } finally {

        NProgress.done();
        closeRejectModal(); // Tutup modal setelah reject
    }
};

const downloadBuktiPenyaluran = async (fileUrl) => {
    try {
        if (!fileUrl) {
            console.error('Bukti penyaluran tidak tersedia.');
            return;
        }

        // Memulai permintaan unduhan file
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Gagal mengunduh file: ${response.statusText}`);
        }

        // Mengubah respons menjadi blob
        const blob = await response.blob();

        // Membuat tautan unduhan dinamis
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileUrl.split('/').pop(); // Menyimpan file dengan nama aslinya
        document.body.appendChild(link);
        link.click();

        // Menghapus tautan setelah unduhan selesai
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error saat mengunduh file:', error);
    }
}
onMounted(() => {
    fetchAdminReports();
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
