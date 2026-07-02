<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { clearAuth } = useAuth();
const supabase = useCreateSupabase();
const toast = useToast();

// 当前用户邮箱
const userEmail = ref<string | null>(null);

// 侧边栏导航菜单
const navItems: NavigationMenuItem[][] = [
  [
    {
      label: "首页",
      to: "/dashboard/home",
      icon: "i-lucide-home",
    },
    {
      label: "目标中心",
      to: "/dashboard/goals",
      icon: "i-lucide-folder-kanban",
    },
    {
      label: "项目空间",
      to: "/dashboard/projects",
      icon: "i-lucide-folder-open",
    },
    {
      label: "学习与资料",
      to: "/dashboard/learn",
      icon: "i-lucide-brain",
    },
  ],
];

/** 退出登录 */
async function handleLogout() {
  await clearAuth();
  await navigateTo("/");
  toast.add({
    title: "已退出登录",
    color: "success",
  });
}

// 获取当前用户信息
onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  userEmail.value = data.session?.user?.email ?? null;
});
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :default-size="12">
      <!-- 侧边栏顶部：品牌标识 -->
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sprout" class="size-5 text-primary shrink-0" />
          <span class="text-sm font-semibold text-default truncate">Growth OS</span>
        </div>
      </template>

      <!-- 侧边栏导航菜单 -->
      <template #default>
        <UNavigationMenu :items="navItems" orientation="vertical" />
      </template>

      <!-- 侧边栏底部：用户面板 -->
      <template #footer>
        <div class="min-w-0 w-full overflow-hidden">
          <UUser
            v-if="userEmail"
            :name="userEmail"
            description="个人面板"
            :avatar="{ icon: 'i-lucide-user' }"
            class="w-full"
          />
          <div v-else class="flex items-center gap-2">
            <USkeleton class="size-8 rounded-full shrink-0" />
            <div class="flex-1 space-y-1.5 min-w-0">
              <USkeleton class="h-3 w-3/4" />
              <USkeleton class="h-2.5 w-1/2" />
            </div>
          </div>
        </div>
      </template>
    </UDashboardSidebar>

    <!-- 主内容区 -->
    <UDashboardPanel>
      <!-- 顶栏 -->
      <UDashboardNavbar>
        <template #right>
          <UPopover :content="{ align: 'end' }">
            <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" />
            <template #content>
              <div class="p-2 flex flex-col gap-2 w-48">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">主题</span>
                  <UColorModeSelect />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">语言</span>
                  <CommonLocaleSelect />
                </div>
                <div class="border-t border-default pt-2">
                  <UButton
                    block
                    color="error"
                    variant="ghost"
                    label="退出登录"
                    icon="i-lucide-log-out"
                    @click="handleLogout"
                  />
                </div>
              </div>
            </template>
          </UPopover>
        </template>
      </UDashboardNavbar>

      <!-- 页面内容 -->
      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
