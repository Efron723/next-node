// 匯入 bcrypt
import bcrypt from "bcrypt";

// 宣告密碼
const pw = "13579";

// 後端的 await 可以不用用 async 包起來直接使用
const hash = await bcrypt.hash(pw, 8); // (宣告的密碼，saltRound 加鹽幾次)

// 輸出加鹽過的密碼
console.log({ hash });

const hash2 = "$2b$12$5Ao8OA.b0.o6ENkRcBu9c.TE7GRnsjlAIg96JWfx0NA6uoAGWsFNa";

// 比對兩者是否相同
// 雖然每次加鹽過的密碼都不一樣，但是都跟原密碼相同
const result = await bcrypt.compare("13579_", hash2);
console.log({ result });
