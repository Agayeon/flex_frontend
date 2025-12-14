import checkBlueIcon from "@assets/icons/icon-check-blue.svg"
import deleteIcon from "@assets/icons/icon-delete.svg"
import questionIcon from "@assets/icons/icon-question.svg"

import type { ButtonProps } from "@/widgets/common/Button"

/* =========================
 * 공용 타입
 * ========================= */
type ModalActionType = "confirm" | "submit" | "close" | "cancel"

export type ModalButton = Omit<ButtonProps, "children" | "onClick"> & {
  text?: string
  actionType?: ModalActionType
  to?: string
}

type AlertConfig = {
  type?: "alert"
  icon?: string
  message?: string
  buttons: ModalButton[]
}

type ModalConfigRecord = {
  paySuccess: AlertConfig
  loading: AlertConfig
  noPaymentInfo: AlertConfig
  refundMentos: AlertConfig
}

export const MODAL_CONFIG: ModalConfigRecord = {
  paySuccess: {
    icon: checkBlueIcon,
    message: "결제가 완료되었습니다!",
    buttons: [{ text: "확인", variant: "primary", size: "lg", actionType: "close" }],
  },

  loading: {
    message: "처리 중입니다...",
    buttons: [],
  },

  noPaymentInfo: {
    icon: deleteIcon,
    message: "결제 정보가 없습니다.",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  refundMentos: {
    icon: questionIcon,
    message: "정말 환불하시겠습니까?",
    buttons: [
      { text: "확인", variant: "primary", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },
}

export type ModalKey = keyof ModalConfigRecord

export function isFormConfig() {
  return false
}
