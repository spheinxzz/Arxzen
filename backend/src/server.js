require("dotenv").config();

const app = require("./app");
const { port } = require("./config/config");

app.listen(port, "0.0.0.0", () => {
  console.log(`Arxzen API running on 0.0.0.0:${port}`);
});
