import type { FunctionalComponent } from 'vue'
import {
  Target, Globe2, Megaphone, Users, ShoppingCart, TrendingUp,
  Headphones, UserPlus, Gavel, Code, Ship, Share2,
} from 'lucide-vue-next'
import { skillCommonIcons } from '@/utils/skillIcons'

/** 专家团图标映射（与 data/expertTeams.ts 中 icon 字段对应） */
export const teamIconMap: Record<string, FunctionalComponent> = {
  Target,
  Globe2,
  Megaphone,
  ShoppingCart,
  TrendingUp,
  Headphones,
  UserPlus,
  Gavel,
  Code,
  Ship,
  Share2,
}

/** 通用专家团相关图标（复用 skillCommonIcons + 补充） */
export const teamCommonIcons = {
  ...skillCommonIcons,
  Users,
}
