<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const { clearAuth } = useAuth();
const supabase = useCreateSupabase();
const toast = useToast();

const userEmail = ref<string | null>(null);

const navItems: NavigationMenuItem[][] = [
  [
    {
      label: t("Nav Home"),
      to: "/dashboard/home",
      icon: "i-lucide-home",
    },
    {
      label: t("Nav Goals"),
      to: "/dashboard/goals",
      icon: "i-lucide-folder-kanban",
    },
    {
      label: t("Nav Projects"),
      to: "/dashboard/projects",
      icon: "i-lucide-folder-open",
    },
    {
      label: t("Nav Learn"),
      to: "/dashboard/learn",
      icon: "i-lucide-brain",
    },
  ],
  [
    {
      label: t("Nav AI"),
      to: "/dashboard/ai",
      icon: "i-lucide-sparkles",
    },
    {
      label: t("Nav Settings"),
      to: "/dashboard/settings",
      icon: "i-lucide-settings",
    },
  ],
];

async function handleLogout() {
  await clearAuth();
  await navigateTo("/");
  toast.add({
    title: t("Logout Success"),
    color: "success",
  });
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  userEmail.value = data.session?.user?.email ?? null;
});
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :default-size="12">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sprout" class="size-5 text-primary shrink-0" />
          <span class="text-sm font-semibold text-default truncate">{{ t("Brand Name") }}</span>
        </div>
      </template>

      <template #default>
        <UNavigationMenu :items="navItems" orientation="vertical" />
      </template>

      <template #footer>
        <div class="min-w-0 w-full overflow-hidden">
          <UUser
            v-if="userEmail"
            :name="userEmail"
            :description="t('User Panel')"
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

    <UDashboardPanel>
      <UDashboardNavbar>
        <template #right>
          <UPopover :content="{ align: 'end' }">
            <UButton
              icon="i-lucide-settings-2"
              color="neutral"
              variant="ghost"
              :aria-label="t('Settings')"
            />
            <template #content>
              <div class="p-2 flex flex-col gap-2 w-48">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">{{ t("Settings Theme") }}</span>
                  <UColorModeSelect />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">{{ t("Settings Lang") }}</span>
                  <CommonLocaleSelect />
                </div>
                <div class="border-t border-default pt-2">
                  <UButton
                    block
                    color="error"
                    variant="ghost"
                    :label="t('Logout')"
                    icon="i-lucide-log-out"
                    @click="handleLogout"
                  />
                </div>
              </div>
            </template>
          </UPopover>
        </template>
      </UDashboardNavbar>

      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
