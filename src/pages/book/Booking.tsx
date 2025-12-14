import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

import { useCalendar, useKoreanHolidays } from "@hooks"
import { Calendar } from "@widgets/booking"
import TimeGrid from "@widgets/booking/TimeGrid"

import { toYMD } from "@shared/lib/datetime"

type NavState = Partial<{
  title: string
  price: number
  mentosSeq: number
  category: string
  mentorName: string
}>

const MOCK = {
  mentosSeq: 9999,
  title: "플렉스 하기 위한 재테크 팁",
  price: 100000,
  mentorName: "김플렉스",
  category: "tips",
  times: ["10:00", "11:00", "14:00", "15:00", "19:00"],
}

export default function BookingPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: NavState }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")

  const [search] = useSearchParams()
  const qs = search.get("mentorId") ?? search.get("mentosSeq")

  const mentosSeq =
    state?.mentosSeq ?? (qs && !Number.isNaN(Number(qs)) ? Number(qs) : undefined) ?? MOCK.mentosSeq

  const title = state?.title ?? MOCK.title
  const price = typeof state?.price === "number" ? state.price : MOCK.price
  const mentorName = state?.mentorName ?? MOCK.mentorName
  const category = state?.category ?? MOCK.category

  // 달력 훅
  const {
    currentMonth,
    setCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
    generateCalendar,
    isToday,
    isPastDate,
    isCurrentMonth,
  } = useCalendar(new Date())

  // 공휴일
  const { isHoliday, getHolidayName } = useKoreanHolidays(currentMonth.getFullYear())

  // 최초 진입 시 오늘 날짜/현재 월로 세팅
  useEffect(() => {
    const now = new Date()
    setSelectedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1))
  }, [setCurrentMonth])

  const days = useMemo(() => generateCalendar(currentMonth), [currentMonth, generateCalendar])

  // 날짜 선택
  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return

    if (!isCurrentMonth(date)) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }

    setSelectedDate(date)
    setSelectedTime("")
  }

  const canReserve = Boolean(selectedDate && selectedTime && title)

  const handleReservation = () => {
    if (!canReserve || !selectedDate) return

    navigate("/booking/confirm", {
      state: {
        title,
        price,
        mentosSeq,
        mentorName,
        category,
        date: toYMD(selectedDate),
        time: selectedTime,
      },
    })
  }

  return (
    <div className="flex h-[calc(100vh-48px)] w-full justify-center overflow-x-hidden bg-[#F7FAFF] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 pl-2 text-[20px] font-bold">{title}</h1>

        <p className="mt-2 mb-10 pl-2 text-sm text-slate-500">
          멘토: <span className="font-semibold text-slate-700">{mentorName}</span> · 비용:{" "}
          <span className="font-semibold text-slate-700">{price.toLocaleString()}원</span>
        </p>

        <div className="px-2">
          <Calendar
            currentMonth={currentMonth}
            days={days}
            isToday={isToday}
            isPastDate={isPastDate}
            isHoliday={isHoliday}
            getHolidayName={getHolidayName}
            selectedDate={selectedDate}
            onSelectDate={handleDateClick}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
          />

          <TimeGrid
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            apiTimes={MOCK.times}
          />

          <button
            type="button"
            onClick={handleReservation}
            disabled={!canReserve}
            className={`font-WooridaumB h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99] ${
              canReserve
                ? "cursor-pointer bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}>
            예약하기
          </button>
        </div>
      </section>
    </div>
  )
}
