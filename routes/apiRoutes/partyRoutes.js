const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

// display parties table
router.get("/parties", (req, res) => {
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
router.get("/party/:id", (req, res) => {
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
router.delete("/party/:id", (req, res) => {
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

module.exports = router;