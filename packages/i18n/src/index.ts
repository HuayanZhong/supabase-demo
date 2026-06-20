import { fileURLToPath } from "url";

import zh from "../locales/zh.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };

export { zh, en };

// 供 @nuxtjs/i18n 直接使用的 langDir
export const langDir = fileURLToPath(new URL("../locales/", import.meta.url));
