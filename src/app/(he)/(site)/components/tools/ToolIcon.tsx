import {
  Accessibility,
  Calculator,
  CalendarDays,
  CalendarRange,
  Clock,
  FileText,
  Hourglass,
  ImageDown,
  Landmark,
  Lock,
  Mail,
  MessageCircle,
  Percent,
  QrCode,
  Receipt,
  ScrollText,
  Search,
  ShieldCheck,
  Type,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { ToolIconName } from '@/lib/tools'

const icons: Record<ToolIconName, LucideIcon> = {
  accessibility: Accessibility,
  calculator: Calculator,
  calendar: CalendarDays,
  calendarRange: CalendarRange,
  clock: Clock,
  file: FileText,
  hourglass: Hourglass,
  image: ImageDown,
  landmark: Landmark,
  lock: Lock,
  mail: Mail,
  message: MessageCircle,
  percent: Percent,
  qr: QrCode,
  receipt: Receipt,
  scroll: ScrollText,
  search: Search,
  shield: ShieldCheck,
  type: Type,
  wrench: Wrench,
}

export default function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  const Icon = icons[name] ?? Wrench
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />
}
