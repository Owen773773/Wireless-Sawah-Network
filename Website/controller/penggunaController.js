import * as penggunaService from "../service/penggunaService.js";

export const getPengguna = async (req, res) => {
  try {
    const data = await penggunaService.getAllPengguna();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const simpanPengguna = async (req, res) => {
  try {
    const { username, password, tipeAkun, email, noTelepon } = req.body;

    if (!username || !password || !tipeAkun) {
      return res.status(400).json({
        success: false,
        message: "username, password, dan tipeAkun wajib diisi",
      });
    }

    const penggunaBaru = await penggunaService.simpanPengguna({
      username,
      password,
      tipeAkun,
      email, 
      noTelepon
    });

    res.status(201).json({
      success: true,
      message: "Pengguna berhasil ditambahkan",
      data: penggunaBaru,
    });
  } catch (error) {
    // username duplicate
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Username sudah ada",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getPenggunaById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await penggunaService.getPenggunaById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
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

export const editPengguna = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, tipeAkun, email, noTelepon } = req.body;

    if (!username || !tipeAkun) {
      return res.status(400).json({
        success: false,
        message: "username dan tipeAkun wajib diisi",
      });
    }

    const updated = await penggunaService.editPengguna(id, {
      username,
      password,
      tipeAkun,
      email,
      noTelepon
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pengguna berhasil diperbarui",
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

export const deletePengguna = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await penggunaService.deletePengguna(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pengguna berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
