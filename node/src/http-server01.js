// 從 node:http 匯入 http   node:http不能有空格
import http from "node:http";
// request response 簡寫 req res
const server = http.createServer((req, res) => {
  // 200是狀態碼
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(`
  <h2>Hello!!!</h2>
  <p>${req.url}</p>
  `);
});

server.listen(3000);
