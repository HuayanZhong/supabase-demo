export default defineNuxtRouteMiddleware(async () => {
  // 由 routeRules.appMiddleware 指定匹配路径，无需在这里判断
  const { checkAuth } = useAuth();

  if (!(await checkAuth())) {
    return navigateTo("/");
  }
});
