<script setup lang="ts">
const { t } = useI18n();

const calendarDate = ref();

const weather = {
  city: t("Weather City"),
  temp: 26,
  tempLow: 18,
  condition: t("Weather Sunny"),
  icon: "i-lucide-sun",
  humidity: 58,
  wind: "12 km/h",
  uvIndex: 6,
};
</script>

<template>
  <div
    class="md:col-span-2 lg:col-span-2 rounded-xl border border-default bg-default overflow-hidden"
  >
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10">
        <UIcon name="i-lucide-calendar" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("Calendar") }}</span>
    </div>
    <div class="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="rounded-lg bg-elevated p-3">
        <UCalendar v-model="calendarDate" size="sm" />
      </div>
      <div class="flex flex-col gap-3">
        <div class="rounded-lg bg-elevated p-4 flex-1">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-muted font-medium">{{ weather.city }}</p>
              <p class="text-4xl font-bold text-highlighted mt-1 tracking-tight">
                {{ weather.temp }}°
              </p>
              <p class="text-sm text-toned mt-0.5">
                {{ weather.condition }} · {{ weather.tempLow }}° ~ {{ weather.temp }}°
              </p>
            </div>
            <UIcon :name="weather.icon" class="size-12 text-warning" />
          </div>
          <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-default">
            <div class="text-center space-y-1">
              <UIcon name="i-lucide-droplets" class="size-4 text-info mx-auto" />
              <p class="text-xs text-muted">{{ weather.humidity }}%</p>
              <p class="text-[10px] text-muted/70">{{ t("Weather Humidity") }}</p>
            </div>
            <div class="text-center space-y-1">
              <UIcon name="i-lucide-wind" class="size-4 text-muted mx-auto" />
              <p class="text-xs text-muted">{{ weather.wind }}</p>
              <p class="text-[10px] text-muted/70">{{ t("Weather Wind") }}</p>
            </div>
            <div class="text-center space-y-1">
              <UIcon name="i-lucide-sun" class="size-4 text-warning mx-auto" />
              <p class="text-xs text-muted">UV {{ weather.uvIndex }}</p>
              <p class="text-[10px] text-muted/70">UV</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg border border-dashed border-default p-4">
          <p class="text-xs text-muted mb-1.5 font-medium">{{ t("DailyQuote") }}</p>
          <p class="text-sm text-default italic leading-relaxed">"{{ t("DailyQuoteText") }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>
