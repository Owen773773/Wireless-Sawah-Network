import pool from "../db/db.js";

/**
 * Get semua jenis lahan dengan rentang normal
 */
export const getAllJenisLahan = async () => {
    const query = `
    SELECT 
      jenis,
      phmin,
      phmax,
      suhuudaramin,
      suhuudaramax,
      suhutanahmin,
      suhutanahmax,
      kelembapantanahmin,
      kelembapantanahmax,
      kelembapanudaramin,
      kelembapanudaramax,
      cahayamin,
      cahayamax
    FROM JenisLahan
    ORDER BY jenis
  `;

    const result = await pool.query(query);
    return result.rows;
};

/**
 * Get jenis lahan berdasarkan nama jenis
 */
export const getJenisLahanByNama = async (jenis) => {
    const query = `
    SELECT 
      jenis,
      phmin,
      phmax,
      suhuudaramin,
      suhuudaramax,
      suhutanahmin,
      suhutanahmax,
      kelembapantanahmin,
      kelembapantanahmax,
      kelembapanudaramin,
      kelembapanudaramax,
      cahayamin,
      cahayamax
    FROM JenisLahan
    WHERE jenis = $1
  `;

    const result = await pool.query(query, [jenis]);
    return result.rows[0];
};

/**
 * Tambah jenis lahan baru
 */
export const addJenisLahan = async (data) => {
    const query = `
    INSERT INTO JenisLahan (
      jenis, phmin, phmax, suhuudaramin, suhuudaramax,
      suhutanahmin, suhutanahmax, kelembapantanahmin, kelembapantanahmax,
      kelembapanudaramin, kelembapanudaramax, cahayamin, cahayamax
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;

    const values = [
        data.jenis,
        data.phmin,
        data.phmax,
        data.suhuudaramin,
        data.suhuudaramax,
        data.suhutanahmin,
        data.suhutanahmax,
        data.kelembapantanahmin,
        data.kelembapantanahmax,
        data.kelembapaanudaramin,
        data.kelembapaanudaramax,
        data.cahayamin,
        data.cahayamax
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};
