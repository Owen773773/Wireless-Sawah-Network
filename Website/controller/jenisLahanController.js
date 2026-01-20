import * as jenisLahanService from "../service/jenisLahanService.js";

/**
 * GET semua jenis lahan
 */
export const getAllJenisLahan = async (req, res) => {
    try {
        const data = await jenisLahanService.getAllJenisLahan();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET jenis lahan by nama
 */
export const getJenisLahanByNama = async (req, res) => {
    try {
        const { nama } = req.params;

        const data = await jenisLahanService.getJenisLahanByNama(nama);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Jenis lahan tidak ditemukan",
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST tambah jenis lahan
 * (khusus admin)
 */
export const tambahJenisLahan = async (req, res) => {
    try {
        const jenisLahanBaru = await jenisLahanService.tambahJenisLahan(req.body);

        res.status(201).json({
            success: true,
            message: "Jenis lahan berhasil ditambahkan",
            data: jenisLahanBaru,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
