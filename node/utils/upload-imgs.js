import multer from "multer";

// import { v4 as uuidv4 } from "uuid";
// 如果要換名稱這樣寫，在大專案理裡可能會不知道 v4 是代表什麼
// 所以換成 uuidv4 就會知道代表什麼
import { v4 } from "uuid"; // uuid 產生一個標準雜湊

const extMap = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// !!轉換成布林值
const fileFilter = (req, file, callback) => {
  // file.mimetype 對應到上面 extMap 裡的副檔名格式，
  // 如果沒有這個格式就是 undefined 轉換為布林值就是 false，有就是 true
  callback(null, !!extMap[file.mimetype]);
};

// const myStorage 改名稱
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
// null 不能省略，設定要不要丟 error 沒有要丟就寫 null
// 第按個參數寫要存放的位置，不要 / 開頭，會變成 C槽根目錄
    callback(null, "public/img");
  },
  filename: (req, file, callback) => {
// 隨機 id + 副檔名，這樣儲存時就可以有副檔名    
    const f = v4() + extMap[file.mimetype];
    callback(null, f);
  },
});

// 如果要改名稱這樣寫
// export default multer({ fileFilter, storage: myStorage });
// 包成 object 的形式
export default multer({ fileFilter, storage });