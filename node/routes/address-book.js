// 匯入 express
import express from "express";
// 匯入 moment-timezone
import moment from "moment-timezone";
// 匯入 ./../utils/connect-mysql.js 連接資料庫
import db from "./../utils/connect-mysql.js";
// 匯入 自己寫的新增資料頁面
import upload from "./../utils/upload-imgs.js";

// 宣告日期格式
const dateFormat = "YYYY-MM-DD";

// 創建了一個新的路由器物件，在最終通過 export default router; 將其導出
const router = express.Router();

// 宣告了一個名為 getListData 的非同步函數，接受一個參數 req（請求物件）
const getListData = async (req) => {
  // 有沒有成功取得資料
  let success = false;

  // 宣告了一個名為 redirect 的變數，初始值為空字串
  // 在後續程式碼中，如果頁數不合法（例如小於 1 或大於總頁數），會將此變數設置為對應的重定向 URL
  let redirect = "";

  // 每頁最多有幾筆資料
  const perPage = 25;

  // 如果 NAN 就 = 1，用戶要看第幾頁
  // 從 query string 最得 page 的值
  // let page = parseInt(req.query.page) || 1;
  // 這裡 + 號是隱式轉換，形別轉換成數值
  // a = "2e3"，+a = 2000，2e3 就是 2X10的3次方
  // 如果你要讓 page = 0，就把這邊的 1 改成 0，這樣在 url 輸入 0 就會自動變成 1 了
  // 但這樣首頁重整就會跳出 page = 1
  let page = +req.query.page || 1;

  // 檢查頁數是否小於 1
  if (page < 1) {
    // 如果頁數小於 1，則設定 redirect 變數為 "?page=1"
    redirect = "?page=1";
    // 返回一個包含 success 和 redirect 的物件
    return { success, redirect };
  }

  // 獲取響應的 queryString 的 keyword，有就獲取沒有就空值
  let keyword = req.query.keyword || "";
  let birth_begin = req.query.birth_begin || "";
  let birth_end = req.query.birth_end || "";

  // SQL 語法中 WHERE 1 = true (永遠為真)，WHERE 0 = false (不存在)
  // SELECT * FROM address_book WHERE 1; === SELECT * FROM address_book;
  // 使用 WHERE 1 可以簡化代碼邏輯，每次添加新條件時都不需要檢查是否需要在條件前加上 AND
  let where = " WHERE 1 ";

  // 如果有 keyword 就將上面宣告的 WHERE 子句連接模糊查詢的關鍵字
  if (keyword) {
    // SQL 裡要加變數外面要加單引號，但是 escape() 跳脫語法會自動加單引號所以如果有使用就不用加
    // 如果用模糊搜尋的話，要加單引號不能使用雙引號
    // where += ` AND \`name\` LIKE '%${keyword}%' `; // 沒有處理 SQL injection

    // db.escape 是跳脫語法，處理 SQL injection 問題
    // 沒有處理的話在搜尋輸入文字中間加單引號就會 serve crash，ex : 雅'婷
    // 處理過後文字中間加單引號只會沒有資料顯示出來
    const keyword_ = db.escape(`%${keyword}%`); // { keyword_: "'%雅\\'婷%'" }
    console.log({ keyword_ });

    // 因為 db.escape 外面會自動加單引號，所以 ${keyword} 外面不用在加單引號
    // 搜尋 name 和 mobile 欄位關鍵字
    where += ` AND ( \`name\` LIKE ${keyword_} OR \`mobile\` LIKE ${keyword_} ) `; // 處理 SQL injection
  }

  // 這裡使用 moment 方法搜尋 生日欄位大於多少就顯示出來
  if (birth_begin) {
    const m = moment(birth_begin);
    if (m.isValid()) {
      where += ` AND birthday >= '${m.format(dateFormat)}' `;
    }
  }

  // 這裡使用 moment 方法搜尋 生日欄位小於多少就顯示出來
  if (birth_end) {
    const m = moment(birth_end);
    if (m.isValid()) {
      where += ` AND birthday <= '${m.format(dateFormat)}' `;
    }
  }

  // 取得總頁數，並將上面宣告的模糊搜尋加入 SQL 語法
  const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
  // [[{ totalRows }]] 多重解構
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0; // 總頁數, 預設值
  let rows = []; // 分頁資料

  // 這行代碼檢查 totalRows 是否有值，確保資料庫中有資料存在。如果沒有資料，這段代碼塊將不會執行
  if (totalRows) {
    // 計算總頁數，使用 Math.ceil，因為即使最後一頁的資料不滿一整頁，也需要計算為一整頁
    totalPages = Math.ceil(totalRows / perPage);

    if (page > totalPages) {
      // 如果頁數大於總頁數則跳轉到總頁數最後一頁
      redirect = `?page=${totalPages}`;
      // 返回一個包含 success 和 redirect 的物件
      return { success, redirect };
    }

    // 取得分頁資料，並將上面宣告的模糊搜尋加入 SQL 語法
    // 使用降冪，先篩選後再排序，這樣效能較好，用這種記法
    const sql = `SELECT * FROM \`address_book\` ${where} ORDER BY sid DESC LIMIT ${
      (page - 1) * perPage
    },${perPage}`;

    // SQL 查詢結果賦值給 rows 變數，這是一個非同步操作，會等待查詢結果返回
    [rows] = await db.query(sql);

    // 原本日期格式為 Wed May 31 1995 00:00:00 GMT+0800 (台北標準時間)
    // 變更之後的日期格式 1995-05-31
    // 將上面宣告的 dateFormat 日期格式遍歷，返回你要的日期格式
    rows.forEach((el) => {
      const m = moment(el.birthday);
      // 無效的日期格式, 使用空字串
      el.birthday = m.isValid() ? m.format(dateFormat) : "";
    });
  }

  // 這行代碼將 success 變數設置為 true，表示成功取得資料
  success = true;

  // 將以下資料渲染到 address-book/list
  return {
    success,
    perPage,
    page,
    totalRows,
    totalPages,
    rows,

    // qs 是一個物件
    // ex : http://example.com?page=2&keyword=test
    // 那麼 req.query 會是一個物件，包含 { page: '2', keyword: 'test' }
    qs: req.query,
  };
};

// 模擬網路延遲的狀況 middleware
// router.use((req, res, next) => {
//   const ms = 100 + Math.floor(Math.random() * 2000);
//   setTimeout(() => {
//     next();
//   }, ms);
// });

// // 設定頂層 middleware
// router.use((req, res, next) => {
//   let u = req.url.split("?")[0];
//   // 下面通訊錄列表的 url 去掉之後是 /，但是新增列表的 url 去掉之後是 /add
//   // 所以如果你的 url 是 / 才能通過，沒登入就可以看到列表，但是不能看到新增頁面
//   if (["/", "/api"]) {
//     return next();
//   }
//   if (req.session.admin) {
//     // 有登入, 就通過
//     next();
//   } else {
//     // 沒有登入, 就跳到登入頁
//     res.redirect("/login");
//   }
// });

// 用戶訪問根路徑（即 /）時，會執行這個非同步函數
// 當用戶請求資料時，能夠正確處理頁數錯誤並返回對應的 HTML 頁面
router.get("/", async (req, res) => {
  // 給 address-book 增加 title
  res.locals.title = "通訊錄列表 | " + res.locals.title;

  // 給 address-book 增加 pageName 為 ab_list
  res.locals.pageName = "ab_list";

  // 取得資料：呼叫 getListData(req) 函數取得資料
  const data = await getListData(req);

  // 處理重定向：如果 data 中包含 redirect 屬性，則進行頁面重定向（例如當頁數不合法時）
  if (data.redirect) {
    return res.redirect(data.redirect);
  }

  // 渲染頁面：如果 data.success 為 true，則將資料渲染到 address-book/list
  if (data.success) {
    res.render("address-book/list", data);
  }
});

// 用戶訪問 /api 路徑時，會執行這個非同步函數
// 提供一個 API 接口，允許用戶以 JSON 格式取得分頁資料
// http://localhost:3001/address-book/api
router.get("/api", async (req, res) => {
  // 取得資料：呼叫 getListData(req) 函數取得資料
  const data = await getListData(req);

  // 返回 JSON：將取得的資料以 JSON 格式返回給用戶端
  res.json(data);
});

// 新增表單頁面路由，用戶訪問 /api 路徑時，會渲染 address-book/add
// get 方法，呈現表單
router.get("/add", async (req, res) => {
  // 新增 title
  res.locals.title = "新增通訊錄 | " + res.locals.title;
  // 新增 pageName
  res.locals.pageName = "ab_add";
  res.render("address-book/add");
});

// post 方法，處理表單，前端使用 fetch 會自動轉換為 multipart/form-data
// 後端這邊就要做處理，使用 upload.none() 沒有要上傳檔案
// 返回 JSON：將取得的資料以 JSON 格式返回給用戶端
// router.post("/add", [upload.none()], async (req, res) => {
//   res.json(req.body);
// });

// 新增頁面的 fetch 更改使用 json 格式
// 這樣就不是 multipart/form-data 不需要 upload.none() 來處理
// 所以這邊使用 json 格式
router.post("/add", async (req, res) => {
  // TODO: 欄位資料的檢查
  // 以下是原始方法，雖然較冗長但比較不會有問題
  // 新增這些欄位， ? 是佔位符
  // const sql =
  //   "INSERT INTO address_book (`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

  // // 返回新增的資料到 body 上
  // const [result] = await db.query(sql, [
  //   req.body.name,
  //   req.body.email,
  //   req.body.mobile,
  //   req.body.birthday,
  //   req.body.address,
  // ]);

  // 以下是簡短寫法
  // 將 req.body 解構複製
  let body = { ...req.body };
  // 因為只使用一個佔位符 ?，created_at 沒有被賦值，所以這邊用 new Date() 賦值
  body.created_at = new Date();

  // 解決生日不填也可以的問題
  // 使用 moment 解析表單提交的 body.birthday
  const m = moment(body.birthday);
  // isValid() 判斷是否為有效日期，format(dateFormat) 轉換日期格式 ("YYYY-MM-DD")
  body.birthday = m.isValid() ? m.format(dateFormat) : null;

  // 使用一個佔位符 ?，對應到 body 裡每一個欄位
  const sql = "INSERT INTO address_book SET ?";
  // 將 body 對象中的資料作為參數傳遞進去，
  // 必需包含所有需要插入到資料庫的欄位和值，除非有預設值
  const [result] = await db.query(sql, [body]);

  // 以 json 形式返回結果
  res.json({
    result,
    // "affectedRows": 值為1，表示有一行數據被插入或更新，值為0則沒有
    // !! 將其轉換為布林值傳遞給 success
    success: !!result.affectedRows,
  });
  /*
  {
    "fieldCount": 0,
    "affectedRows": 1, 受影響的行數，值為1，表示有一行數據被插入或更新
    "insertId": 5007,  新插入記錄的ID
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 0  在UPDATE語句中，這個值表示實際更改的行數
  }
  */
});

// 刪除資料的 API
router.delete("/api/:sid", async (req, res) => {
  const output = {
    // 初始化響應對象
    success: false,
    code: 0,
    result: {},
  };

  // 如果 req 或 req.my_jwt 是 undefined 或 null，
  // 則 req.my_jwt.id 會引發錯誤，而 req.my_jwt?.id 只會返回 undefined
  if (!req.my_jwt?.id) {
    // 沒有登入
    output.code = 470;
    return res.json(output);
  }

  // 從請求參數中取得 sid，並轉換為數字，如果是 NAN 則為 0
  const sid = +req.params.sid || 0;
  // 如果 sid 為無效值 0，則返回初始值
  if (!sid) {
    output.code = 480;
    return res.json(output);
  }

  // SQL 語法，刪除對應的 id 欄位
  const sql = `DELETE FROM address_book WHERE sid=${sid}`;
  // SQL 查詢的資料儲存在解構賦值 result 中，在儲存到初始化的 result 中
  const [result] = await db.query(sql);
  output.result = result;
  // 根據 affectedRows 更新 success 屬性
  output.success = !!result.affectedRows;

  // output 使用 json 返回結果
  res.json(output);
});

// 編輯的表單頁
// 轉向 /edit/:sid 這個 URL
router.get("/edit/:sid", async (req, res) => {
  // 一定要轉換成數值，不然會有 SQL injection 的問題
  const sid = +req.params.sid || 0;
  // 如果不是數值是 0 或 NAN 就跳轉頁面到 /address-book
  if (!sid) {
    return res.redirect("/address-book");
  }

  const sql = `SELECT * FROM address_book WHERE sid=${sid}`;
  const [rows] = await db.query(sql);
  if (!rows.length) {
    // 沒有該筆資料就跳轉頁面到 /address-book
    return res.redirect("/address-book");
  }

  // 只顯示第一筆資料，因為也只能編輯一筆資料
  // res.json(rows[0]);

  // 將 rows[0].birthday 轉換日期格式返回給 rows[0]
  rows[0].birthday = moment(rows[0].birthday).format(dateFormat);

  // 渲染到這裡 address-book/edit 的第一筆
  res.render("address-book/edit", rows[0]);
});

// 取得單項資料的 API
router.get("/api/:sid", async (req, res) => {
  const sid = +req.params.sid || 0;
  if (!sid) {
    return res.json({ success: false, error: "沒有編號" });
  }

  const sql = `SELECT * FROM address_book WHERE sid=${sid}`;
  const [rows] = await db.query(sql);
  if (!rows.length) {
    // 沒有該筆資料
    return res.json({ success: false, error: "沒有該筆資料" });
  }

  const m = moment(rows[0].birthday);
  rows[0].birthday = m.isValid() ? m.format(dateFormat) : "";

  res.json({ success: true, data: rows[0] });
});

// 處理編輯的表單
// 用 PUT 方法接收，因為後端送出格式是
router.put("/api/:sid", upload.none(), async (req, res) => {
  // 初始化響應對象
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  // 從請求參數中取得 sid，並轉換為數字，如果是 NAN 則為 0
  const sid = +req.params.sid || 0;
  // 如果 sid 為無效值 0，則返回初始值
  if (!sid) {
    return res.json(output);
  }

  //
  let body = { ...req.body };
  const m = moment(body.birthday);
  body.birthday = m.isValid() ? m.format(dateFormat) : null;

  // try catch 處理錯誤，更新指定 sid 的資料
  try {
    const sql = "UPDATE `address_book` SET ? WHERE sid=? ";

    // 使用 await 等待查詢的結果並存儲在 output.result
    // db.query 方法執行 SQL 語句，並且 req.body 包含了要更新的數據
    // sid 是要更新的記錄標誌
    const [result] = await db.query(sql, [body, sid]);
    output.result = result;
    // affectedRows 受影響的行數、changedRows 有更改的行數
    // 必需都為 1，並且轉換布林值，帶入給 success 代表編輯成功
    // 如果沒有修改則 changedRows 為 0，跳出 modal 無做修改
    output.success = !!(result.affectedRows && result.changedRows);
    // 如果在 try 區塊中的代碼執行過程中發生錯誤，錯誤將被捕獲並存儲在 output.error 中
  } catch (ex) {
    output.error = ex;
  }

  res.json(output);
});

// 將定義好的 router 物件作為模組的默認輸出，其他文件可以引入並使用這個路由
export default router;
