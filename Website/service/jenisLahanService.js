import * as jenisLahanRepo from "../repository/jenisLahanRepo.js";

/**
 * Ambil semua jenis lahan
 */
export const getAllJenisLahan = async () => {
    return await jenisLahanRepo.getAllJenisLahan();
};

/**
 * Ambil jenis lahan berdasarkan nama
 */
export const getJenisLahanByNama = async (nama) => {
    return await jenisLahanRepo.getJenisLahanByNama(nama);
};

/**
 * Tambah jenis lahan baru
 */
export const tambahJenisLahan = async (data) => {
    return await jenisLahanRepo.addJenisLahan({
        jenis: data.jenis,
        phmin: data.phMin,
        phmax: data.phMax,
        suhuudaramin: data.suhuUdaraMin,
        suhuudaramax: data.suhuUdaraMax,
        suhutanahmin: data.suhuTanahMin,
        suhutanahmax: data.suhuTanahMax,
        kelembapantanahmin: data.kelembapanTanahMin,
        kelembapantanahmax: data.kelembapanTanahMax,
        kelembapaanudaramin: data.kelembapanUdaraMin,
        kelembapaanudaramax: data.kelembapanUdaraMax,
        cahayamin: data.cahayaMin,
        cahayamax: data.cahayaMax,
    });
};
