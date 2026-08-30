import type { FunctionalComponent } from 'vue'
import {
  FileCheck2, Globe2, Scale, Wand2, BarChart3, Megaphone,
  TrendingUp, BookOpen, ShoppingCart, Ship, Headphones, Truck,
  UserPlus, Store, Gavel, Lightbulb, Code, Clapperboard, Share2,
  Sparkles, ArrowRight, CheckCircle2, Play, Terminal, Search, Tag, Zap,
} from 'lucide-vue-next'

/** Skill 图标映射（与 data/skills.ts 中 icon 字段对应） */
export const skillIconMap: Record<string, FunctionalComponent> = {
  FileCheck2,
  Globe2,
  Scale,
  Wand2,
  BarChart3,
  Megaphone,
  TrendingUp,
  BookOpen,
  ShoppingCart,
  Ship,
  Headphones,
  Truck,
  UserPlus,
  Store,
  Gavel,
  Lightbulb,
  Code,
  Clapperboard,
  Share2,
}

/** 通用 Skill 相关图标 */
export const skillCommonIcons = {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Terminal,
  Search,
  Tag,
  Zap,
}
