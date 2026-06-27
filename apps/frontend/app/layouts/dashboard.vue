<script setup lang="ts">
const route = useRoute();
const { clearAuth } = useAuth();
const toast = useToast();

// 侧边栏导航链接
const navLinks = [
  { label: "首页", to: "/dashboard/home", icon: "i-lucide-home" },
  { label: "项目空间", to: "/dashboard/projects", icon: "i-lucide-folder-kanban" },
];

/** 判断当前路由是否匹配导航项 */
function isActive(path: string) {
  return route.path === path;
}

/** 退出登录 */
async function handleLogout() {
  await clearAuth();
  await navigateTo("/");
  toast.add({
    title: "退出登录成功",
    color: "success",
  });
}
</script>

<template>
  <UDashboardGroup>
    <!-- 侧边栏 -->
    <UDashboardSidebar :default-size="12">
      <!-- 侧边栏顶部：品牌标识 -->
      <template #header>
        <div class="flex items-center gap-2 px-2">
          <UIcon name="i-lucide-sprout" class="size-5 text-primary shrink-0" />
          <span class="text-sm font-semibold text-default truncate">Growth OS</span>
        </div>
      </template>

      <!-- 侧边栏导航菜单 -->
      <template #default>
        <nav class="flex flex-col gap-1">
          <UButton
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :variant="isActive(link.to) ? 'soft' : 'ghost'"
            color="neutral"
            class="justify-start"
            :icon="link.icon"
          >
            {{ link.label }}
          </UButton>
        </nav>
      </template>

      <!-- 侧边栏底部：用户操作 -->
      <template #footer>
        <UButton
          variant="ghost"
          color="neutral"
          class="justify-start"
          icon="i-lucide-log-out"
          @click="handleLogout"
        >
          退出
        </UButton>
      </template>
    </UDashboardSidebar>

    <!-- 主内容区 -->
    <UDashboardPanel>
      <!-- 顶栏 -->
      <UDashboardNavbar>
        <template #right>
          <UColorModeButton />
          <CommonLocaleSelect />
        </template>
      </UDashboardNavbar>

      <!-- 页面内容 -->
      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
