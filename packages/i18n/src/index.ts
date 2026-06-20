import { fileURLToPath } from "url";

import zh_cn from "../locales/zh_cn.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import ja from "../locales/ja.json" with { type: "json" };

export { zh_cn, en, ja };

// 供 @nuxtjs/i18n 直接使用的 langDir
export const langDir = fileURLToPath(new URL("../locales/", import.meta.url));
