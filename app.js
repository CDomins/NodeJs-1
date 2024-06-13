const http = require("http");
const usernames = ["username1", "username2"];
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
        <h1>Hello</h1>
        <form action="/create-user" method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username">
          <button type="submit">Submit</button>
        </form>
      `);
    return res.end();
  }

  if (req.url === "/users" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write("<ul>");
    usernames.forEach((username) => {
      res.write(`<li>${decodeURIComponent(username)}</li>`);
    });
    res.write("</ul>");
    return res.end();
  }

  if (req.url === "/create-user" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log("Username:", username);
      usernames.push(username);
      res.statusCode = 302;
      res.setHeader("Location", "/users");
      return res.end();
    });
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.write("<h1>404 Not Found</h1>");
  res.end();
});

server.listen(3000);
