import { getRequestConfig } from "next-intl/server";
import { site } from "@/site.config";

const LOCALES = ["en", "pt", "es"];

export default getRequestConfig(async () => {
  const base = site.locale.split("-")[0].toLowerCase();
  const messagesLocale = LOCALES.includes(base) ? base : "en";

  return {
    locale: site.locale,
    messages: (await import(`../translations/${messagesLocale}.json`)).default,
  };
});
