export default defineNuxtRouteMiddleware(async () => {
  try {
    const { user } = await $fetch("/api/auth/session");
    if (!user) {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/");
  }
});
