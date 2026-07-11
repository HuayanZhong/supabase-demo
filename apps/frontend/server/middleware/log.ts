// 请求日志中间件 — 记录每个 API 请求的 method 和 path
export default defineEventHandler((event) => {
  console.log("新请求: " + getRequestURL(event));
});
