const imagePath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get("host")}/imgs/`; // controllare url
  next();
}

module.exports = imagePath;