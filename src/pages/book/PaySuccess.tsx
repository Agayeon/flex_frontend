import { MODAL_CONFIG } from "@/shared/ui/ModalConfig"
import CommonModal from "@/widgets/common/CommonModal"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"]
const fmt = (ymd?: string, time?: string) => {
  if (!ymd) return "-"
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1)
  return `${m}.${d}(${weekdayKo[dt.getDay()]}) ${time ?? ""}`
}

const buildMessage = (title: string, when: string, amount: number) => (
  <div className="flex flex-col items-center gap-4 text-center">
    <p className="font-WooridaumB text-lg">결제 완료</p>
    <div className="w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="font-WooridaumB text-lg text-[#222939]">{title}</p>
      <p className="font-WooridaumR text-sm text-[#287EFF]">{when}</p>
      <p className="font-WooridaumR text-sm">{amount.toLocaleString()}원</p>
    </div>
  </div>
)

type PayState = Partial<{
  title: string
  date: string
  time: string
  price: number
}>

export default function PaySuccess() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: PayState }

  const title = state?.title ?? "결제 완료"
  const when = fmt(state?.date, state?.time)
  const amount = typeof state?.price === "number" ? state!.price : 0

  const [tick, setTick] = useState(0)
  const [open, setOpen] = useState(true)

  const setOnceRef = useRef(false)

  useEffect(() => {
    if (setOnceRef.current) return
    setOnceRef.current = true

    // 모달 메시지 교체
    MODAL_CONFIG.paySuccess.message = buildMessage(title, when, amount)
    setTick((t) => t + 1)
  }, [title, when, amount])

  const goHome = () => {
    setOpen(false)
    navigate("/", { replace: true })
  }

  return (
    <CommonModal
      key={tick}
      type="paySuccess"
      isOpen={open}
      onConfirm={goHome}
      onCancel={goHome}
      confirmDisabled={false}
    />
  )
}
