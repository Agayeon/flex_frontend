import React, { useEffect, useState } from "react"

interface Props {
  children: React.ReactNode
  // 로딩 표시를 지연시킬 시간 = 300ms
  delay?: number
}

export default function DelayedFallback({ children, delay = 1000 }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return show ? <>{children}</> : null
}
