export function protectRoute(req, res, next) {
  if (req.session.isLoggedIn) {
    req.user = {
      id: req.session.idPengguna,
      tipeAkun: req.session.tipeAkun,
      username: req.session.username,
    };
    next();
  } else {
    return res.redirect("/");
  }
}
