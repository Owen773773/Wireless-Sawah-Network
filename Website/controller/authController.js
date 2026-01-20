import pool from "../db/db.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT idPengguna, username, password, tipeAkun
       FROM Pengguna
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    // cek user & password
    if (!user || password !== user.password) {
      return res.status(401).json({
        message: "Username atau Password salah",
      });
    }

    // SET SESSION
    req.session.isLoggedIn = true;
    req.session.idPengguna = user.idpengguna;
    req.session.username = user.username;
    req.session.tipeAkun = user.tipeakun;

    return res.json({
      success: true,
      message: "Login berhasil!",
      user: {
        name: user.username,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat login",
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Gagal logout.");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
};
