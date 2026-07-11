/** 全局登录检查中间件：未登录用户拦截到登录页 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 公开路由放行
  if (to.path === "/" || to.path === "/verify-email") {
    return;
  }

  const { checkAuth } = useAuth();

  if (!(await checkAuth())) {
    if (import.meta.client) {
      const toast = useToast();
      toast.add({
        title: "登录失效，请先登录",
        color: "warning",
      });
    }
    return navigateTo("/");
  }
});
