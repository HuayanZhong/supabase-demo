export default defineNuxtRouteMiddleware(async (to) => {
  // 只保护仪表盘路由
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  try {
    const { user } = await $fetch("/api/auth/session");
    if (!user) {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/");
  }
});
