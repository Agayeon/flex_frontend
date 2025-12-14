// src/pages/home2/Home2.tsx
import { CategoryButtonGroup } from "@/widgets/home2/CategoryButton"
import { CharacterFigure } from "@/widgets/home2/CharacterFigure"
import { HeroBubble } from "@/widgets/home2/HeroBubble"
import { LoginSheet } from "@/widgets/home2/LoginSheet"
import { PrimaryActions } from "@/widgets/home2/PrimaryActions"

import { useAuth } from "@/entities/auth"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

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

  /* ===============================
   * Auth / User State
   * =============================== */
  const isLoggedIn = !!user
  const memberName = user?.memberName ?? "회원"
  const role = normalizeRole((user as any)?.memberType ?? (user as any)?.role)
  const aiHelperName = role === "mentor" ? "모리" : "토리"

  /* ===============================
   * Login Modal State
   * =============================== */
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  /* ===============================
   * RequireAuth → login=1 트리거 처리
   * =============================== */
  useEffect(() => {
    if (searchParams.get("login") === "1") {
      setShowLoginForm(true)
      searchParams.delete("login")
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  /* ===============================
   * Login Submit
   * =============================== */
  const handleLoginSubmit = async ({ id, pw, role }: { id: string; pw: string; role: Role }) => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const userType = role === "mentor" ? "MENTO" : "MENTI"
      await login({ userType, memberId: id, memberPwd: pw })

      setShowLoginForm(false)

      // 🔑 보호 라우트에서 넘어온 경우 원래 위치로 복귀
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

  /* ===============================
   * Hero Text
   * =============================== */
  const rotateTexts =
    isLoggedIn && role === "mentee"
      ? [
          `어서오세요! ${memberName}님 \n오늘도 좋은 하루 되세요!`,
          `${memberName}님, 관심 분야 멘토링을 추천받고싶으시면 \n멘토링 추천받기를 눌러보세요!`,
          `궁금한 점이 있다면 언제든 물어보세요, ${memberName}님!`,
        ]
      : isLoggedIn && role === "mentor"
        ? [
            `환영합니다, ${memberName} 멘토님!`,
            `오늘도 멘티들과 멋진 지식을 나눠보세요.`,
            `궁금한 점이 있으면 언제든 저 ${aiHelperName}에게 물어보세요!`,
          ]
        : [
            "안녕하세요 \n로그인하고 멘토링을 추천받아보세요!",
            "아직 계정이 없으신가요?\n지금 바로 가입하고 시작해보세요!",
            "로그인 후 더 많은 기능을 이용할 수 있어요!",
          ]

  /* ===============================
   * Render
   * =============================== */
  return (
    <main className="relative grid h-[calc(100vh-48px)] w-full grid-rows-[auto_1fr_auto] bg-[#F7FAFF] px-4">
      {/* 상단 카테고리 */}
      <section className="mx-auto mt-5 w-full max-w-lg">
        <CategoryButtonGroup onSelectCategory={(key) => navigate(`/booking?category=${key}`)} />
      </section>

      {/* 중앙 히어로 */}
      <section className="mx-auto flex w-full max-w-md flex-col items-center justify-around">
        <HeroBubble
          text={`안녕하세요! 저는 메멘토의 AI 도우미 ‘${aiHelperName}’예요.`}
          highlight={memberName}
          rotateTexts={rotateTexts}
          intervalMs={10_000}
          role={role}
          showTalkCTA
          talkLabel="대화하기"
          onClickTalk={() => navigate("/recommend")}
        />
        <CharacterFigure glowed={isLoggedIn} role={role} />
      </section>

      {/* 하단 액션 */}
      <PrimaryActions
        isLoggedIn={isLoggedIn}
        role={role}
        onRecommend={() => navigate("/recommend")}
        onOpenLogin={() => setShowLoginForm(true)}
      />

      {/* 로그인 모달 */}
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
