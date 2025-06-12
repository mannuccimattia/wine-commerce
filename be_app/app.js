const express = require("express");
const app = express();

// destructuring process.env
const { SERVER_PORT, FE_APP } = process.env;

// set port
const port = SERVER_PORT || 3000;

// import CORS
// const cors = require("cors");

// import router
// const moviesRouter = require("./routers/moviesRouter");

// import middlewares
// const errorsHandler = require("./middlewares/errorsHandler");
// const notFound = require("./middlewares/notFound");
// const imagePathMiddleware = require("./middlewares/imagePath");

// use CORS
// app.use(cors({ origin: FE_APP }));

// set ./public as static 
app.use(express.static("public"));

// use json parser
// app.use(express.json());

// use imagePath middleware
// app.use(imagePathMiddleware);


// entry point
app.get("/", (req, res) => {
  res.send("Movies API server");
})

// use router
// app.use("/api/movies", moviesRouter);

// use middlewares
// app.use(errorsHandler);
// app.use(notFound);

// leave on listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`)
})