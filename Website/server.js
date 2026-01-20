import express from "express";
import "dotenv/config";
import pool from "./db/db.js";
import session from "express-session";
import routes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "apapun_juga_bisa_lah",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 Jam
  })
);

app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
  return res.redirect("/login");
});

app.use(routes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

//untuk bagian pengguna di admin
app.use("/api", routes);