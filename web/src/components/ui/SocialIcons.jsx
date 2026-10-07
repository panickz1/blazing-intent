import {
  DiscordIcon,
  XTwitterIcon,
  TelegramIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  TwitchIcon,
  KickIcon,
  SnapchatIcon,
  FacebookIcon,
  WhatsAppIcon,
  UsersIcon,
} from "@/components/ui/icons";

const BRAND_ICONS = [
  [/discord/i, DiscordIcon],
  [/(?:^|\/\/)(?:www\.)?(?:x|twitter)\.com/i, XTwitterIcon],
  [/t\.me|telegram/i, TelegramIcon],
  [/instagram/i, InstagramIcon],
  [/tiktok/i, TikTokIcon],
  [/youtube|youtu\.be/i, YouTubeIcon],
  [/twitch/i, TwitchIcon],
  [/kick\.com/i, KickIcon],
  [/snapchat/i, SnapchatIcon],
  [/facebook|fb\.com/i, FacebookIcon],
  [/whatsapp|wa\.me/i, WhatsAppIcon],
];

export function brandIconFor(url = "") {
  return BRAND_ICONS.find(([pattern]) => pattern.test(url))?.[1] ?? null;
}

export function CommunityIcon({ url, className }) {
  return (brandIconFor(url) ?? UsersIcon)({ className });
}
