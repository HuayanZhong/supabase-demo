export default defineNuxtRouteMiddleware(async () => {
  const toast = useToast();
  // 由 routeRules.appMiddleware 指定匹配路径，无需在这里判断
  const { checkAuth } = useAuth();

  if (!(await checkAuth())) {
    toast.add({
      title: "登录失效，请先登录",
      color: "warning",
    });
    return navigateTo("/");
  }
});
