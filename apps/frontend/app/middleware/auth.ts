export default defineNuxtRouteMiddleware(async () => {
  const toast = useToast();

  // 由 routeRules.appMiddleware 指定匹配路径，无需在这里判断
  try {
    const { user } = await $fetch("/api/auth/session");
    if (!user) {
      toast.add({
        title: "登录失效，请先登录",
        color: "warning",
      });
      return navigateTo("/");
    }
  } catch {
    toast.add({
      title: "登录失败，请先登录",
      color: "error",
    });
    return navigateTo("/");
  }
});
