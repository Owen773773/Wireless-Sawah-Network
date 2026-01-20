import pool from "../db/db.js";

export const getAllPengguna = async () => {
  const query = `
    SELECT idPengguna, username, tipeAkun, email, noTelepon
    FROM Pengguna
    ORDER BY idPengguna
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const simpanPengguna = async ({ username, password, tipeAkun, email, noTelepon }) => {
  const query = `
    INSERT INTO Pengguna (username, password, tipeAkun, email, noTelepon)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING idPengguna, username, tipeAkun, email, noTelepon
  `;

  const values = [username, password, tipeAkun, email, noTelepon];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getPenggunaById = async (id) => {
  const query = `
    SELECT idPengguna, username, tipeAkun, email, noTelepon
    FROM Pengguna
    WHERE idPengguna = $1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const editPengguna = async (id, { username, password, tipeAkun, email, noTelepon }) => {
  // kalo password diubah
  if (password) {
    const query = `
      UPDATE Pengguna
      SET username = $1,
          password = $2,
          tipeAkun = $3,
          email = $4,
          noTelepon = $5
      WHERE idPengguna = $6
      RETURNING idPengguna
    `;

    const { rowCount } = await pool.query(query, [
      username,
      password,
      tipeAkun,
      email,
      noTelepon,
      id
    ]);

    return rowCount > 0;
  }

  // kalau password tidak diubah
  const query = `
    UPDATE Pengguna
    SET username = $1,
        tipeAkun = $2,
        email = $3,        
        noTelepon = $4
    WHERE idPengguna = $5
    RETURNING idPengguna
  `;

  const { rowCount } = await pool.query(query, [username, tipeAkun, email, noTelepon, id]);

  // berhasil update atau ngga gtu
  return rowCount > 0;
};

export const deletePengguna = async (id) => {
  const query = `
    DELETE FROM Pengguna
    WHERE idPengguna = $1
  `;

  const { rowCount } = await pool.query(query, [id]);
  return rowCount > 0;
};
