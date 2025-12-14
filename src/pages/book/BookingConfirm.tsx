import { useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

import BookingSummaryCard from "@/widgets/booking/BookingSummaryCard"

type BookingState = {
  title: string
  date: string
  time: string
  price: number
  mentosSeq?: number
  mentorName?: string
  category?: string
}

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"]

function formatWhen(ymd: string, time: string) {
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1)
  return `${m}.${d}(${weekdayKo[dt.getDay()]}) ${time}`
}

export default function BookingConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sp] = useSearchParams()

  // location.state로 넘어온 예약 데이터 우선 사용
  const booking = (location.state || {}) as Partial<BookingState>

  // 멘토 식별자는 state가 없을 수도 있으니 query로도 fallback
  const mentosSeq = booking.mentosSeq ?? Number(sp.get("mentosSeq") ?? sp.get("mentorId") ?? 0)

  const valid =
    !!booking.date &&
    !!booking.time &&
    !!booking.title &&
    typeof booking.price === "number" &&
    mentosSeq > 0

  const whenText = useMemo(
    () => (valid ? formatWhen(booking.date!, booking.time!) : "-"),
    [valid, booking.date, booking.time],
  )

  const [submitting, setSubmitting] = useState(false)

  // 과제용 결제 시뮬레이션 (로그인/실제 결제 API 없음)
  const handlePay = async () => {
    if (!valid || submitting) return

    setSubmitting(true)

    const payload = {
      title: booking.title!,
      date: booking.date!,
      time: booking.time!,
      price: booking.price!,
      mentosSeq,
      mentorName: booking.mentorName ?? "김플렉스",
      category: booking.category,
      paidAt: new Date().toISOString(),
      paymentKey: "mock_payment_key",
      orderId: `mock_order_${Date.now()}`,
    }

    try {
      const prev = JSON.parse(localStorage.getItem("mock:myMentoring") || "[]")
      localStorage.setItem("mock:myMentoring", JSON.stringify([payload, ...prev]))
    } catch {
      // ignore
    }

    // 결제 성공
    setTimeout(() => {
      navigate("/payments/success", { replace: true, state: payload })
      setSubmitting(false)
    }, 400)
  }

  return (
    <div className="flex min-h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-[#F7FAFF] px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-10 pl-2 text-[20px] font-bold">예약 내역</h1>

        <div className="px-2">
          <p className="font-WooridaumR mb-4 text-[16px] text-[#000008]">
            선택하신 항목이 맞는지 확인해주세요.
          </p>

          <BookingSummaryCard title={booking.title ?? "-"} whenText={whenText} />

          <div className="mt-2 mb-4 flex items-center justify-between">
            <span className="font-WooridaumR text-[17px] text-[#3F3E6D]">지금 결제할 금액</span>
            <span className="font-WooridaumR text-[17px] text-[#FC4C4E]">
              {typeof booking.price === "number" ? `${booking.price.toLocaleString()}원` : "-"}
            </span>
          </div>

          {!valid && (
            <div className="mb-3 rounded-xl bg-white p-3 text-sm text-gray-600 ring-1 ring-black/5">
              예약 정보가 부족합니다. 예약 페이지에서 다시 선택해주세요.
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={!valid || submitting}
            className={[
              "mt-2 mb-3 h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99]",
              valid && !submitting
                ? "cursor-pointer bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-[#1E90FF]/40",
              "font-WooridaumB",
            ].join(" ")}>
            {submitting ? "처리 중..." : "결제하기"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="font-WooridaumB h-14 w-full rounded-2xl bg-gray-300 text-base font-extrabold text-gray-600 hover:bg-gray-400">
            취소하기
          </button>
        </div>
      </section>
    </div>
  )
}
