import { useEffect, useState } from "react"

type Role = "MENTI" | "MENTO"
type User = {
  memberName: string
  memberType: Role
  role: Role
}

type LoginInput = {
  memberId: string
  memberPwd: string
  userType: Role
}

const KEY = "mock_user_session"
const DEMO_ID = "flex"
const DEMO_PW = "1234"

function read(): User | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function write(user: User | null) {
  if (!user) sessionStorage.removeItem(KEY)
  else sessionStorage.setItem(KEY, JSON.stringify(user))
  window.dispatchEvent(new Event("mock-auth-changed"))
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  // 새로고침 시 sessionStorage에서 복원
  useEffect(() => {
    const sync = () => setUser(read())
    sync()

    const onChanged = () => sync()
    window.addEventListener("mock-auth-changed", onChanged)
    return () => window.removeEventListener("mock-auth-changed", onChanged)
  }, [])

  // mock data인 flex/1234만 로그인 성공
  const login = async (input: LoginInput) => {
    const id = input?.memberId?.trim()
    const pw = input?.memberPwd

    if (id !== DEMO_ID || pw !== DEMO_PW) {
      throw new Error("ID는 flex / PW는 1234 입니다.")
    }

    const next: User = {
      memberName: "플렉스",
      memberType: input.userType,
      role: input.userType,
    }

    write(next)
    setUser(next)
    return next
  }

  const logout = async () => {
    write(null)
    setUser(null)
  }

  return { user, isAuthenticated: !!user, login, logout }
}
