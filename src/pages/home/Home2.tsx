import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { useAuth } from "@/entities/auth"
import { CategoryButtonGroup } from "@/widgets/home2/CategoryButton"
import { CharacterFigure } from "@/widgets/home2/CharacterFigure"
import { HeroBubble } from "@/widgets/home2/HeroBubble"
import { LoginSheet } from "@/widgets/home2/LoginSheet"
import { PrimaryActions } from "@/widgets/home2/PrimaryActions"

type Role = "mentee" | "mentor"

function normalizeRole(memberType?: string | null): Role | undefined {
  const t = (memberType ?? "").toUpperCase().trim()
  if (t === "MENTEE" || t === "MENTI") return "mentee"
  if (t === "MENTOR" || t === "MENTO") return "mentor"
  return undefined
}

const REDIRECT_KEY = "postLoginRedirect"

export default function Home2() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, login } = useAuth()

  const isLoggedIn = !!user
  const memberName = user?.memberName ?? "회원"
  const role = normalizeRole(user?.memberType ?? user?.role)
  const aiHelperName = role === "mentor" ? "모리" : "토리"

  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // RequireAuth → login=1 트리거 처리
  useEffect(() => {
    if (searchParams.get("login") === "1") {
      setShowLoginForm(true)
      const next = new URLSearchParams(searchParams)
      next.delete("login")
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleLoginSubmit = async ({ id, pw, role }: { id: string; pw: string; role: Role }) => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const userType = role === "mentor" ? "MENTO" : "MENTI"
      await login({ userType, memberId: id, memberPwd: pw })

      setShowLoginForm(false)

      const redirect = sessionStorage.getItem(REDIRECT_KEY)
      if (redirect) {
        sessionStorage.removeItem(REDIRECT_KEY)
        navigate(redirect, { replace: true })
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요."
      setLoginError(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const rotateTexts = useMemo(() => {
    if (isLoggedIn && role === "mentee") {
      return [
        `어서오세요! ${memberName}님 \n오늘도 좋은 하루 되세요!`,
        `${memberName}님, 관심 분야 멘토링을 추천받고싶으시면 \n멘토링 추천받기를 눌러보세요!`,
        `궁금한 점이 있다면 언제든 물어보세요, ${memberName}님!`,
      ]
    }

    if (isLoggedIn && role === "mentor") {
      return [
        `환영합니다, ${memberName} 멘토님!`,
        `오늘도 멘티들과 멋진 지식을 나눠보세요.`,
        `궁금한 점이 있으면 언제든 저 ${aiHelperName}에게 물어보세요!`,
      ]
    }

    return [
      "안녕하세요 \n로그인하고 멘토링을 추천받아보세요!",
      "아직 계정이 없으신가요?\n지금 바로 가입하고 시작해보세요!",
      "로그인 후 더 많은 기능을 이용할 수 있어요!",
    ]
  }, [aiHelperName, isLoggedIn, memberName, role])

  return (
    <main className="relative grid h-[calc(100vh-48px)] w-full grid-rows-[auto_1fr_auto] bg-[#F7FAFF] px-4">
      <section className="mx-auto mt-5 w-full max-w-lg">
        <CategoryButtonGroup onSelectCategory={(key) => navigate(`/booking?category=${key}`)} />
      </section>

      <section className="mx-auto flex w-full max-w-md flex-col items-center justify-around">
        <HeroBubble
          text={`안녕하세요! 저는 메멘토의 AI 도우미 ‘${aiHelperName}’예요.`}
          highlight={memberName}
          rotateTexts={rotateTexts}
          intervalMs={10_000}
          role={role}
          showTalkCTA={false}   // 과제 범위에서 제외(추천 페이지 미구현)
        />
        <CharacterFigure glowed={isLoggedIn} role={role} />
      </section>

      <PrimaryActions
        isLoggedIn={isLoggedIn}
        role={role}
        onOpenLogin={() => setShowLoginForm(true)}
        onRecommend={() => {
          alert("과제 범위에서는 추천 기능을 제외하고 예약 흐름 중심으로 구성했습니다.")
        }}
      />

      <LoginSheet
        open={showLoginForm && !isLoggedIn}
        onClose={() => setShowLoginForm(false)}
        onSubmit={handleLoginSubmit}
        error={loginError}
        loading={isLoggingIn}
      />
    </main>
  )
}
