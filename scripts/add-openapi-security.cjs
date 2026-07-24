/**
 * 向 openapi.json 添加 Bearer Auth 安全方案
 */
const fs = require("fs");
const path = require("path");

const fp = path.resolve(__dirname, "../openapi.json");
const raw = fs.readFileSync(fp, "utf-8").replace(/^\uFEFF/, "");
const spec = JSON.parse(raw);

spec.components.securitySchemes = {
  bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
};

spec.security = [{ bearer: [] }];

spec.paths["/api/health"].get.security = [];
spec.paths["/api/v1/auth/me"].get.security = [];

fs.writeFileSync(fp, JSON.stringify(spec, null, 2), "utf-8");
console.log("OK: openapi.json");
