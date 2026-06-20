import { fileURLToPath } from "url";

import zhCN from "../locales/zh-CN.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import ja from "../locales/ja.json" with { type: "json" };
import ko from "../locales/ko.json" with { type: "json" };

export { zhCN, en, ja, ko };

// 供 @nuxtjs/i18n 直接使用的 langDir
export const langDir = fileURLToPath(new URL("../locales/", import.meta.url));
