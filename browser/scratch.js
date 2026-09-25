const http = require('https');
const url = "https://www.google.com/goto?url=CAESlQEB6zswFRvsXschUpV4CCzp1aNIxooTIL61dAY4QzcAcW9RPSLYJ2aRzYE2fB89eCzhpq8rN8nW-dr7CCDMwYwlycFsX46prIRadrsUAWF1fFkaRPIo8xW1VUELH5xybsgypgj5MDgMkA2DJTYh6ydXK_U0r43uglnmmPsx6FOs1_LjvkzZeCOXK55JaC0IIwqCWcjC4Q";

http.get(url, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Location:", res.headers.location);
}).on('error', (e) => {
  console.error(e);
});
