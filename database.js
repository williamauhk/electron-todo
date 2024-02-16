const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

db.run(`CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task text NOT NULL,
    done INTEGER DEFAULT 0
)`, (err) => {
  if (err) {
    // Table already created
  } else {
    // Table just created, creating some rows
    let insert = 'INSERT INTO todos (task, done) VALUES (?, ?)';
    db.run(insert, ["example task", 0]);
  }
});

module.exports = db;