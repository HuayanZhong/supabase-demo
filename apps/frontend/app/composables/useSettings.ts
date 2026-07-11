export function useSettings() {
  const { t } = useI18n();

  // 用户资料
  const userProfile = ref({
    name: "张三",
    email: "zhangsan@example.com",
    bio: t("Settings ProfileBio"),
    avatar: "i-lucide-user",
  });

  // 账号设置
  const accountSettings = ref({
    twoFactorEnabled: false,
    lastLogin: "2026-07-10 14:32",
    memberSince: "2026-01-15",
  });

  // 通知偏好
  const notificationSettings = ref({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
  });

  /** 模拟更新资料 */
  function updateProfile(data: Partial<typeof userProfile.value>) {
    Object.assign(userProfile.value, data);
  }

  /** 模拟更新通知设置 */
  function updateNotification(key: keyof typeof notificationSettings.value, value: boolean) {
    notificationSettings.value[key] = value;
  }

  return {
    userProfile,
    accountSettings,
    notificationSettings,
    updateProfile,
    updateNotification,
  };
}
