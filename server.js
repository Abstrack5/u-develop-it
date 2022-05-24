const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const user = config.get('server.user');
const pw = config.get('server.password');

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connecting to Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: user,
        password: pw,
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// display all candidates
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// displays 1 candidate by id
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, rows) => {
//     if (err) {
//         console.log(err);
//     }

//     console.log(rows);
// });

// deletes a candidate by id
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, rows) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(rows);
// });

// create a new candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 VALUES (?,?,?,?)`;

// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// response for requests not found(catchall)
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});