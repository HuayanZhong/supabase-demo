<script setup lang="ts">
// 日历与天气信息卡片
import type { WeatherData } from "@supabase/types/weather";
const { t } = useI18n();

const calendarDateRef = ref();

// 默认城市：北京
const defaultLocationId = "101010100";
const defaultCityName = "北京";

const {
  data: weatherRef,
  pending: loadingRef,
  error: errorRef,
} = await useAsyncData<WeatherData | null>(
  "weather",
  async () => {
    // 先确保城市已缓存到 DB（search 接口会 upsert）
    await $fetch("/api/locations/search", {
      params: { keyword: defaultCityName },
    });

    // 获取实时天气
    return $fetch("/api/weathers/now", {
      params: { locationId: defaultLocationId },
    });
  },
  {
    server: false, // 实时天气数据只在客户端获取
    default: () => null,
  },
);
</script>

<template>
  <div
    class="md:col-span-2 lg:col-span-2 rounded-xl border border-default bg-default overflow-hidden"
  >
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
        <UIcon name="i-lucide-calendar" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("Calendar") }}</span>
    </div>
    <div class="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="rounded-lg bg-elevated p-3">
        <UCalendar v-model="calendarDateRef" size="sm" />
      </div>
      <div class="flex flex-col gap-3">
        <div class="rounded-lg bg-elevated p-4 flex-1">
          <!-- 加载中 -->
          <div v-if="loadingRef" class="flex items-center justify-center h-full">
            <UIcon name="i-lucide-loader-circle" class="size-6 text-muted animate-spin" />
          </div>
          <!-- 错误提示 -->
          <div v-else-if="errorRef" class="flex items-center justify-center h-full">
            <p class="text-sm text-muted">天气加载失败</p>
          </div>
          <!-- 天气数据 -->
          <template v-else-if="weatherRef">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs text-muted font-medium">
                  {{ weatherRef.city }}
                </p>
                <p class="text-4xl font-bold text-highlighted mt-1 tracking-tight">
                  {{ weatherRef.temp }}°
                </p>
                <p class="text-sm text-toned mt-0.5">
                  {{ weatherRef.condition }} · {{ weatherRef.tempLow }}° ~
                  {{ weatherRef.tempHigh }}°
                </p>
              </div>
              <UIcon :name="weatherRef.icon" class="size-12 text-warning" />
            </div>
            <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-default">
              <div class="text-center space-y-1">
                <UIcon name="i-lucide-droplets" class="size-4 text-info mx-auto" />
                <p class="text-xs text-muted">{{ weatherRef.humidity }}%</p>
                <p class="text-[10px] text-muted/70">
                  {{ t("Weather Humidity") }}
                </p>
              </div>
              <div class="text-center space-y-1">
                <UIcon name="i-lucide-wind" class="size-4 text-muted mx-auto" />
                <p class="text-xs text-muted">{{ weatherRef.wind }}</p>
                <p class="text-[10px] text-muted/70">{{ t("Weather Wind") }}</p>
              </div>
              <div class="text-center space-y-1">
                <UIcon name="i-lucide-sun" class="size-4 text-warning mx-auto" />
                <p class="text-xs text-muted">UV {{ weatherRef.uvIndex }}</p>
                <p class="text-[10px] text-muted/70">UV</p>
              </div>
            </div>
          </template>
        </div>
        <div class="rounded-lg border border-dashed border-default p-4">
          <p class="text-xs text-muted mb-1.5 font-medium">
            {{ t("DailyQuote") }}
          </p>
          <p class="text-sm text-default italic leading-relaxed">"{{ t("DailyQuoteText") }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>
