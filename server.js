const apiRoutes = require("./routes/apiRoutes");
const express = require("express");
const db = require("./db/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use api routes
app.use("/api", apiRoutes);

// response for requests not found(catchall)
app.use((req, res) => {
  res.status(404).end();
});

// start server after db connection is established
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
});
