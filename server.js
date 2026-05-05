const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Serve HTML files */
app.use(express.static(__dirname));

/* ══════════════════════════════════════
   DATABASE CONNECTION

   HOW THIS WORKS:
   - On your LOCAL PC:
     MYSQLHOST is not set → uses "localhost"
     MYSQLUSER is not set → uses "root"
     MYSQLPASSWORD is not set → uses "Deepika@2004"
     MYSQLDATABASE is not set → uses "order_tracking"

   - On RENDER (online):
     Railway variables are set → uses Railway MySQL
     Everything connects automatically!
══════════════════════════════════════ */
const db = mysql.createConnection({
  host     : process.env.MYSQLHOST     || "localhost",
  user     : process.env.MYSQLUSER     || "root",
  password : process.env.MYSQLPASSWORD || "Deepika@2004",
  database : process.env.MYSQLDATABASE || "order_tracking",
  port     : process.env.MYSQLPORT     || 3306
});

db.connect(function(err) {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

/* ══════════════════════════════════════
   ADD ORDER
══════════════════════════════════════ */
app.post("/add-order", function(req, res) {
  const {
    customer_id,
    customer_name,
    product_name,
    status,
    order_date,
    delivery_date
  } = req.body;

  const sql = `
    INSERT INTO orders
    (customer_id, customer_name, product_name, status, order_date, delivery_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [customer_id, customer_name, product_name, status, order_date, delivery_date],
    function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error inserting order");
      }
      res.send("Order Added");
    }
  );
});

/* ══════════════════════════════════════
   GET ALL ORDERS
══════════════════════════════════════ */
app.get("/orders", function(req, res) {
  db.query("SELECT * FROM orders ORDER BY id DESC", function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching data");
    }
    res.json(result);
  });
});

/* ══════════════════════════════════════
   DELETE ORDER
══════════════════════════════════════ */
app.delete("/delete-order/:id", function(req, res) {
  db.query("DELETE FROM orders WHERE id=?", [req.params.id], function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Delete error");
    }
    res.send("Deleted");
  });
});

/* ══════════════════════════════════════
   UPDATE STATUS
══════════════════════════════════════ */
app.put("/update-order/:id", function(req, res) {
  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send("Update error");
      }
      res.send("Updated");
    }
  );
});

/* ══════════════════════════════════════
   SERVER START
   Local PC → port 3000
   Render   → Railway sets PORT automatically
══════════════════════════════════════ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Server running on port " + PORT + " 🚀");
});