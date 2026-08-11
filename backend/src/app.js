const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");
const { frontendUrl } = require("./config/config");

const app = express();

app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    service: "Arxzen API",
    status: "online",
    version: "1.0.0",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Arxzen API",
    version: "1.0.0"
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/profiles", require("./routes/profiles"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/security", require("./routes/security"));

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

module.exports = app;
