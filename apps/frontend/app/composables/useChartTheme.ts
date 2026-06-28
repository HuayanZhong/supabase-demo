/**
 * ECharts 主题色 composable
 * 根据当前亮/暗模式返回对应的图表颜色配置
 */
export function useChartTheme() {
  const colorMode = useColorMode();

  const isDark = computed(() => colorMode.value === "dark");

  /** 主文字色：图表标题、数值 */
  const textColor = computed(() => (isDark.value ? "#fafafa" : "#09090b"));

  /** 次要文字色：标签、说明文字 */
  const mutedColor = computed(() => (isDark.value ? "#a1a1aa" : "#71717a"));

  /** 网格/分割线颜色 */
  const gridColor = computed(() => (isDark.value ? "#27272a" : "#e4e4e7"));

  /** 轨道/背景色（仪表盘底色等） */
  const trackColor = computed(() => (isDark.value ? "#3f3f46" : "#e5e7eb"));

  /** 面积填充起始色（用于折线图面积） */
  const areaColorStart = computed(() =>
    isDark.value ? "rgba(250,250,250,0.12)" : "rgba(9,9,11,0.12)",
  );

  /** 面积填充结束色 */
  const areaColorEnd = computed(() => (isDark.value ? "rgba(250,250,250,0)" : "rgba(9,9,11,0)"));

  /** 雷达图填充色 */
  const radarAreaColor = computed(() =>
    isDark.value ? "rgba(250,250,250,0.06)" : "rgba(9,9,11,0.06)",
  );

  /** 雷达图描边/数据点色 */
  const radarLineColor = computed(() => (isDark.value ? "#fafafa" : "#18181b"));

  /** 雷达图数据点边框色（跟随卡片背景） */
  const radarBorderColor = computed(() => (isDark.value ? "#18181b" : "#ffffff"));

  return {
    isDark,
    textColor,
    mutedColor,
    gridColor,
    trackColor,
    areaColorStart,
    areaColorEnd,
    radarAreaColor,
    radarLineColor,
    radarBorderColor,
  };
}
