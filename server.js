const express = require("express");
const mysql = require("mysql2");
const config = require("config");
const inputCheck = require("./utils/inputCheck");

const user = config.get("server.user");
const pw = config.get("server.password");

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connecting to Database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: user,
    password: pw,
    database: "election",
  },
  console.log("Connected to the election database.")
);

// display all candidates
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      res.json({
        message: "success",
        data: rows,
      });
    }
  });
});

// displays 1 candidate by id
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      res.json({
        message: "success",
        data: row
      });
    }
  });
});

// create a new candidate
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.industry_connected,
    body.party_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      res.json({
        messsage: "success",
        data: body,
        changes: result.affectedRows
      });
    }
  });
});

// display parties table
app.get("/api/parties", (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// display 1 party by id
app.get("/api/party/:id", (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

// delete party by id
app.delete("/api/party/:id", (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "party not found",
      });
    } else {
      res.json({
        message: "success",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});


// deletes a candidate by id
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
      return;
    } else if (!result.affectedRows) {
      res.json({ message: "candidate not found" });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});



// Update candidates party
app.put("/api/candidate/:id", (req, res) => {
  const errors = inputCheck(req.body, 'party_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE candidates SET party_id = ?
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "Updated",
        data: req.body,
        changes: result.affectedRows,
      });
    }
  });
});

// response for requests not found(catchall)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
