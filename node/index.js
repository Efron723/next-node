import jwt from "jsonwebtoken";

import express from "express";

import multer from "multer";

import upload from "./utils/upload-imgs.js";

import admin2Router from "./routes/admin2.js";

import session from "express-session";

import moment from "moment-timezone";

import db from "./utils/connect-mysql.js";

import abRouter from "./routes/address-book.js";

import cors from "cors";

import mysql_session from "express-mysql-session";

// 匯入 bcrypt
import bcrypt from "bcrypt";

// const upload = multer({ dest: "tmp_uploads/" });

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    console.log({ origin });
    cb(null, true);
  },
};

app.use(cors(corsOptions));

const MysqlStore = mysql_session(session);
const sessionStore = new MysqlStore({}, db);

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "dkfgdlkg8496749KHJKHLd",
    store: sessionStore,
    /*
    cookie: {
      maxAge: 1800_000
    }
    */
  })
);

app.use((req, res, next) => {
  res.locals.title = "MING的網頁";

  // 讓所有 template 可以使用 session
  res.locals.session = req.session;
  next();
});

app.get("/", (req, res) => {
  res.locals.title = "首頁 | " + res.locals.title;
  res.render("home", { name: "MING" });
});

app.use("/address-book", abRouter);

app.get("/json-sales", (req, res) => {
  res.locals.title = "json-sales | " + res.locals.title;
  res.locals.pageName = "json-sales";
  const sales = [
    {
      name: "Bill",
      age: 28,
      id: "A001",
    },
    {
      name: "Peter",
      age: 32,
      id: "A002",
    },
    {
      name: "Carl",
      age: 29,
      id: "A003",
    },
  ];
  res.render("json-sales", { sales });
});

app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
});

app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

app.post("/try-post", (req, res) => {
  res.json(req.body);
});

app.post("/try-upload", upload.single("avatar"), (req, res) => {
  res.json({
    body: req.body,
    file: req.file,
  });
});

app.post("/try-uploads", upload.array("photos"), (req, res) => {
  res.json(req.files);
});

app.get("/my-params1/:action/:id", (req, res) => {
  res.json(req.params);
});

app.get("/my-params1/:action?/:id?", (req, res) => {
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.slice(3);
  u = u.split("?")[0];
  u = u.split("-").join("");
  res.json({ u });
});

app.use("/admin2", admin2Router);

app.get("/try-sess", (req, res) => {
  req.session.myNum ||= 0;
  req.session.myNum++;
  res.json(req.session);
});

app.get("/try-moment", (req, res) => {
  const fm = "YYYY-MM-DD HH:mm:ss";
  const m1 = moment();
  const m2 = moment(new Date());
  const m3 = moment("2023-10-25");

  const isEqual = m1.isSame(m2);

  res.json({
    m1a: m1.format(fm),
    m1b: m1.tz("Europe/London").format(fm),
    m2a: m2.format(fm),
    m2b: m2.tz("Europe/London").format(fm),
    m3a: m3.format(fm),
    m3b: m3.tz("Europe/London").format(fm),
    isEqual: isEqual,
  });
});

app.get("/try-moment2", (req, res) => {
  const fm = "YYYY-MM-DD HH:mm:ss";
  const m1 = moment("2024-02-29");
  const m2 = moment("2024-05-35");
  const m3 = moment("2023-02-29");

  res.json([
    m1.format(fm),
    m1.isValid(),
    m2.format(fm),
    m2.isValid(),
    m3.format(fm),
    m3.isValid(),
  ]);
});

app.get("/try-db", async (req, res) => {
  const sql = "SELECT * FROM address_book LIMIT 3";
  const [results, fields] = await db.query(sql);
  res.json({ results, fields });
});

app.get("/yahoo", async (req, res) => {
  const r = await fetch("https://tw.yahoo.com/");
  const txt = await r.text();
  res.send(txt);
});

// 渲染登入的頁面 get，URL : /login
app.get("/login", async (req, res) => {
  res.render("login");
});

// 處理登入資料 post，後端格式是 multipart/form-data，使用 upload.none() 處理
app.post("/login", upload.none(), async (req, res) => {
  // 設定初始值
  const output = {
    success: false,
    code: 0,
    body: req.body,
  };

  // SQL 語法查詢 email 欄位
  const sql = "SELECT * FROM members WHERE email=?";
  const [rows] = await db.query(sql, [req.body.email]);

  if (!rows.length) {
    // 帳號是錯的狀態碼
    output.code = 400;
    return res.json(output);
  }

  // 使用 bcrypt 比較輸入的密碼和數據庫中的密碼 hash 
  const result = await bcrypt.compare(req.body.password, rows[0].password);
  if (!result) {
    // 密碼是錯的狀態碼
    output.code = 420;
    return res.json(output);
  }

  // 登入成功返回 true
  output.success = true;

  // 把用戶的ID、電子郵件和暱稱記錄在 session 裡
  req.session.admin = {
    id: rows[0].id,
    email: rows[0].email,
    nickname: rows[0].nickname,
  };

  res.json(output);
});

// 登出
app.get("/logout", (req, res) => {

  // 刪除會話中的 admin 對象
  delete req.session.admin;

  // 將用戶重定向到網站的首頁
  res.redirect("/");
});

// JWT
app.get("/jwt1", (req, res) => {
  const data = {
    id: 17,
    account: "shin",
  };

  const token = jwt.sign(data, process.env.JWT_KEY);
  res.send(token);
});
app.get("/jwt2", (req, res) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImFjY291bnQiOiJzaGluIiwiaWF0IjoxNzE5MTkzMTMwfQ.6ta85NzTZAICtcFfyLkkSHsfaxBa8BjDFEd2dCy7CvY";

  let payload = {};
  try {
    payload = jwt.verify(token, process.env.JWT_KEY);
  } catch (ex) {
    // 如果 token 是無效的
    payload = { ex };
  }

  res.send(payload);
});

app.use(express.static("public"));

app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

app.use((req, res) => {
  res.type("text/plain").status(404).send("走錯路了");
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`Server start: port ${port}`);
});
