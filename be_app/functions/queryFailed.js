const queryFailed = (err, res) => {

  res.status(500).json({
    error: "DB query failed: " + err
  })
}

module.exports = queryFailed;
