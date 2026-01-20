import * as lahanService from "../service/lahanService.js";
import path from "path";

// ambil semua lahan
export const getLahan = async (req, res) => {
  try {
    const data = await lahanService.getAllLahan();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// simpan lahan baru, asumsi di frontend nya ada idPengguna, jadi misal admin nambahin, udah tau nambahin buat penyuluh siapa, penyuluh gabisa nambah lahan sendiri
export const simpanLahan = async (req, res) => {
  try {
    const { namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna } = req.body;

    const lahanBaru = await lahanService.simpanLahan({
      namaSawah,
      luas,
      lokasi,
      namaPemilik,
      jenis,
      idPengguna,
    });

    res.status(201).json({
      success: true,
      message: "Lahan berhasil ditambahkan",
      data: lahanBaru,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ambil lahan berdasarkan id
export const getLahanById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await lahanService.getLahanById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Lahan tidak ditemukan",
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

// edit lahan
export const editLahan = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna } = req.body;

    const updated = await lahanService.editLahan(id, {
      namaSawah,
      luas,
      lokasi,
      namaPemilik,
      jenis,
      idPengguna,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Lahan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Lahan berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// hapus lahan
export const deleteLahan = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await lahanService.deleteLahan(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lahan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Lahan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ambil lahan sesuai penyuluh yang login
export const getLahanByPenyuluh = async (req, res) => {
  try {
    const penyuluhId = req.user.id;

    const data = await lahanService.getLahanByPenyuluh(penyuluhId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// data sensor terbaru
export const getLatestSensor = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await lahanService.getLatestSensor(id);

        // Jika tidak ada data sensor, return success dengan data null (tidak return 404, karena ini bukan error)
        res.json({
            success: true,
            data: data || null,
            message: data ? undefined : "Belum ada data sensor untuk lahan ini"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// data sensor historis
export const getSensorHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, date } = req.query;

        if (!type || !date) {
            return res.status(400).json({
                success: false,
                message: "Query parameter type dan date wajib diisi",
            });
        }

        const data = await lahanService.getSensorHistory(id, type, date);

        // Return empty array jika tidak ada data, bukan error
        res.json({
            success: true,
            data: data || [],
            message: (!data || data.length === 0) ? "Tidak ada data sensor untuk tanggal ini" : undefined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
