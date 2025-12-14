import DelayedFallback from "@/shared/ui/DelayedFallBack"
import LoadingBar from "@/shared/ui/LoadingBar"
import React, { Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import AppLayout from "./layouts/AppLayout"
import HomePage from "@/pages/home/Home2"

const BookingPage = React.lazy(() => import("@/pages/book/Booking"))
const BookingConfirm = React.lazy(() => import("@/pages/book/BookingConfirm"))
const PaySuccess = React.lazy(() => import("@/pages/book/PaySuccess"))

const withSuspense = (el: React.ReactNode) => (
  <Suspense
    fallback={
      <DelayedFallback delay={300}>
        <LoadingBar variant="inline" label="페이지 로딩 중…" />
      </DelayedFallback>
    }>
    {el}
  </Suspense>
)

export const router = createBrowserRouter([
  {
    element: withSuspense(<RootLayout />),
    children: [
      {
        element: withSuspense(<AppLayout />),
        children: [
          { index: true, element: withSuspense(<HomePage />) },
          { path: "/booking", element: withSuspense(<BookingPage />) },
          { path: "/booking/confirm", element: withSuspense(<BookingConfirm />) },
          { path: "/payments/success", element: withSuspense(<PaySuccess />) },
        ],
      },
    ],
  },
])
