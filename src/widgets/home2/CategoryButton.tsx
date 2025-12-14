// src/widgets/home2/CategoryButton.tsx
import { CreditCard, Lightbulb, LineChart, PiggyBank } from "lucide-react"
import type { ReactNode } from "react"

/* ----------------------------- 타입 ----------------------------- */
export type CategoryKey = "consumption" | "tips" | "saving" | "growth"

type CategoryItem = {
  key: CategoryKey
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

/* ----------------------------- 고정 카테고리 ----------------------------- */
const CATEGORIES: CategoryItem[] = [
  { key: "consumption", label: "소비패턴", Icon: CreditCard },
  { key: "tips", label: "생활노하우", Icon: Lightbulb },
  { key: "saving", label: "저축방식", Icon: PiggyBank },
  { key: "growth", label: "자산증식", Icon: LineChart },
]

/* ----------------------------- 단일 버튼 ----------------------------- */
function CategoryButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick?: () => void
}) {
  const base =
    "group inline-flex items-center justify-center gap-1.5 rounded-xl " +
    "border border-blue-200/70 bg-blue-50 px-3 py-2 text-[13px] font-medium text-blue-700 " +
    "shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"

  return (
    <button type="button" onClick={onClick} className={base}>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

/* ----------------------------- 버튼 그룹 ----------------------------- */
export function CategoryButtonGroup({
  onSelectCategory,
  className = "",
}: {
  onSelectCategory?: (key: CategoryKey) => void
  className?: string
}) {
  return (
    <section
      className={`grid w-full grid-cols-2 gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-black/5 backdrop-blur ${className}`}>
      {CATEGORIES.map(({ key, label, Icon }) => (
        <CategoryButton
          key={key}
          icon={<Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />}
          label={label}
          onClick={() => onSelectCategory?.(key)}
        />
      ))}
    </section>
  )
}
