const http = require("http");
const k = http.createServer((req) => {
  console.log(req);
});
k.listen(3000);
