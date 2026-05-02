const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ DATABASE CONNECTION */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deepika@2004",   
  database: "order_tracking"
});

db.connect(err => {
  if(err){
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

/* ===========================
   ADD ORDER (UPDATED)
=========================== */
app.post("/add-order", (req, res) => {

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

  db.query(
    sql,
    [customer_id, customer_name, product_name, status, order_date, delivery_date],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send("Error inserting order");
      }
      res.send("Order Added");
    }
  );
});

/* ===========================
   GET ORDERS
=========================== */
app.get("/orders", (req, res) => {

  const sql = "SELECT * FROM orders ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).send("Error fetching data");
    }
    res.json(result);
  });
});

/* ===========================
   DELETE ORDER
=========================== */
app.delete("/delete-order/:id", (req, res) => {

  const id = req.params.id;

  db.query("DELETE FROM orders WHERE id=?", [id], (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).send("Delete error");
    }
    res.send("Deleted");
  });
});

/* ===========================
   UPDATE STATUS
=========================== */
app.put("/update-order/:id", (req, res) => {

  const id = req.params.id;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, id],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send("Update error");
      }
      res.send("Updated");
    }
  );
});

/* ===========================
   SERVER START
=========================== */
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});