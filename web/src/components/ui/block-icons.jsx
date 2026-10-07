import {
  BadgeCheck,
  ChartColumn,
  Check,
  Clock,
  Dices,
  Eye,
  Gamepad2,
  Gift,
  Headset,
  HeartHandshake,
  Lock,
  Scale,
  Search,
  ShieldCheck,
  Smartphone,
  Spade,
  Star,
  TriangleAlert,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";

const ICONS = {
  shield: ShieldCheck,
  scale: Scale,
  alert: TriangleAlert,
  gift: Gift,
  wallet: Wallet,
  clock: Clock,
  gamepad: Gamepad2,
  dice: Dices,
  cards: Spade,
  headset: Headset,
  lock: Lock,
  search: Search,
  heart: HeartHandshake,
  phone: Smartphone,
  trophy: Trophy,
  star: Star,
  chart: ChartColumn,
  bolt: Zap,
  eye: Eye,
  check: BadgeCheck,
};

export function BlockIcon({ name, className }) {
  const Icon = ICONS[name] ?? Check;
  return <Icon className={className} aria-hidden />;
}
