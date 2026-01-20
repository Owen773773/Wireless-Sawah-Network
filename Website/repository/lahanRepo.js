import pool from "../db/db.js";

// ambil semua lahan (admin)
export const getAllLahan = async () => {
  const query = `
    SELECT 
      s.idsawah,
      s.namaSawah,
      s.luas,
      s.lokasi,
      s.namapemilik,
      s.tanggalditambahkan,
      s.jenis,
      s.idpengguna,
      p.username AS namapenyuluh
    FROM Sawah s
    LEFT JOIN Pengguna p ON s.idpengguna = p.idpengguna
    ORDER BY s.idsawah
  `;

  const result = await pool.query(query);
  return result.rows;
};

async function ensureJenisLahanExists(jenis) {
  const checkQuery = `SELECT jenis FROM JenisLahan WHERE jenis = $1`;
  const checkRes = await pool.query(checkQuery, [jenis]);
  if (checkRes.rowCount === 0) {
    // Insert default jika belum ada
    await pool.query(`INSERT INTO JenisLahan (jenis, phMin, phMax, suhuUdaraMin, suhuUdaraMax, suhuTanahMin, suhuTanahMax, kelembapanTanahMin, kelembapanTanahMax, kelembapanUdaraMin, kelembapanUdaraMax, cahayaMin, cahayaMax) VALUES ($1, 0, 14, 0, 100, 0, 100, 0, 100, 0, 100, 0, 10000)`, [jenis]);
  }
}

// simpan lahan baru
export const simpanLahan = async ({
  namaSawah,
  luas,
  lokasi,
  namaPemilik,
  jenis,
  idPengguna
}) => {
  await ensureJenisLahanExists(jenis);
  const query = `
    INSERT INTO Sawah (namaSawah, luas, lokasi, namapemilik, jenis, idpengguna)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna ?? null];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// ambil lahan berdasarkan id
export const getLahanById = async (id) => {
  const query = `
    SELECT 
      s.idsawah,
      s.luas,
      s.lokasi,
      s.namapemilik,
      s.tanggalditambahkan,
      s.jenis,
      s.idpengguna,
      p.username AS namapenyuluh
    FROM Sawah s
    LEFT JOIN Pengguna p ON s.idpengguna = p.idpengguna
    WHERE s.idsawah = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// edit lahan
export const editLahan = async (
  id,
  { namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna }
) => {
  const query = `
    UPDATE Sawah
    SET namaSawah = $1,
        luas = $2,
        lokasi = $3,
        namapemilik = $4,
        jenis = $5,
        idpengguna = $6
    WHERE idsawah = $7
  `;

  const values = [namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna ?? null, id];

  const result = await pool.query(query, values);
  return result.rowCount > 0;
};

// hapus lahan
export const deleteLahan = async (id) => {
  const result = await pool.query("DELETE FROM Sawah WHERE idsawah = $1", [id]);

  return result.rowCount > 0;
};

// ambil lahan sesuai penyuluh yang login
export const getLahanByPenyuluh = async (idpengguna) => {
  const query = `
    SELECT 
      idsawah,
      namaSawah,
      luas,
      lokasi,
      namapemilik,
      tanggalditambahkan,
      jenis
    FROM Sawah
    WHERE idpengguna = $1
    ORDER BY idsawah
  `;

  const result = await pool.query(query, [idpengguna]);
  return result.rows;
};

// data sensor terbaru
export const getLatestSensor = async (idsawah) => {
  const query = `
    SELECT *
    FROM DataSensor
    WHERE idsawah = $1
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [idsawah]);
  return result.rows[0];
};

// data sensor historis
// export const getSensorHistory = async (idsawah, type, date) => {
//   // whitelist kolom biar aman
//   const allowedTypes = ["suhu", "ph", "oksigen", "kelembapan"];
//   if (!allowedTypes.includes(type)) {
//     throw new Error("Tipe sensor tidak valid");
//   }
//
//   const query = `
//     SELECT
//       timestamp,
//       ${type}
//     FROM DataSensor
//     WHERE idsawah = $1
//       AND DATE(timestamp) = $2
//     ORDER BY timestamp
//   `;
//
//   const result = await pool.query(query, [idsawah, date]);
//   return result.rows;
// };
export const getSensorHistory = async (idsawah, type, date) => {
    // Map frontend sensor names to database columns (case-sensitive PostgreSQL)
    const sensorMap = {
        'suhuudara': 'suhuudara',
        'suhutanah': 'suhutanah',
        'kelembapantanah': 'kelembapantanah',
        'kelembapanudara': 'kelembapanudara',
        'cahaya': 'cahaya',
        'ph': 'ph'
    };

    const dbColumn = sensorMap[type];

    if (!dbColumn) {
        throw new Error(`Tipe sensor tidak valid: ${type}`);
    }

    const query = `
    SELECT 
      timestamp AS waktu,
      ${dbColumn} AS nilai
    FROM DataSensor
    WHERE idsawah = $1
      AND DATE(timestamp) = $2
    ORDER BY timestamp
  `;

    const result = await pool.query(query, [idsawah, date]);
    return result.rows;
};

