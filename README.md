# memento-frontend (Flex Team Frontend 사전 과제)

- 이전에 진행했던 팀 프로젝트인 **금융 멘토링 플랫폼 `me:mento`**를  
  프론트엔드 사전 과제 제출 목적에 맞게 재구성했습니다.
- 백엔드·DB 연동은 제거하고,  
  **홈(로그인 모달) → 예약 → 결제 성공** 흐름을 중심으로  
  구조, 설계 의도, 핵심 로직을 설명할 수 있도록 가지치기했습니다.

---

## 설계 의도 
- Layout 기반 라우팅 구조  
  RootLayout → AppLayout → Page 구조로  
  페이지 공통 영역과 화면 영역을 분리했습니다.

- UI는 widgets로 분리  
  Page는 흐름/라우팅/상태 연결 중심으로 두고,  
  캘린더·시간표·로그인 시트 같은 UI는 widgets로 분리했습니다.

- Mock 인증 (과제 목적에 맞춘 단순화)  
  백엔드 의존 없이 화면·구조·UX를 설명할 수 있도록 mock 인증으로 구성했습니다.  
  새로고침 시 상태 유지보다는  
  면접 환경에서 동일한 흐름을 재현하는 것을 우선했습니다.

과제 특성상 백엔드 연동 없이 동작 확인이 가능하도록 mock 인증으로 구성했습니다. 

## 핵심 논리
- 로그인 여부와 role 상태에 따라 홈 화면 UI가 분기됩니다.
- 인증 로직은 useAuth 훅으로 추상화해 페이지/UI가 인증 방식에 의존하지 않도록 했습니다.
- 예약 페이지는 캘린더/시간 선택 UI를 widgets로 분리해 페이지는 조합 역할만 수행합니다.

## 페이지 확인
- `/` : 홈 (로그인 모달 포함)
- `/booking` : 예약 페이지
- `/payments/success` : 결제 성공 페이지

## 주요 기능

### 1) 홈 + 로그인 모달
- 홈 화면에서 로그인 모달(LoginSheet)을 열고 닫을 수 있습니다.
- 올바른 계정(`flex / 1234`) 입력 시 로그인됩니다.
- 로그인 여부 및 role에 따라 홈 화면 문구와 UI가 변경됩니다.

### 2) 예약 페이지
- 캘린더 및 시간 선택 UI를 제공합니다.
- 예약 관련 UI는 `widgets (Calendar, TimeGrid)`로 분리하여 구성했습니다.

### 3) 결제 성공 페이지
- 결제 완료 후 성공 페이지 진입 및 관련 UI 구성을 포함합니다.

## 프로젝트 구조 (아키텍처)
```
src/
├─ app/                    # 앱 진입 및 전역 설정
│  ├─ App.tsx              # RouterProvider 연결
│  ├─ providers/           # 전역 Provider 묶음
│  │  ├─ AppProviders.tsx
│  │  └─ QueryProvider.tsx
│  └─ routes/              # 라우팅/레이아웃
│     ├─ index.tsx         # 전체 라우팅 정의
│     ├─ layouts/
│     │  ├─ RootLayout.tsx
│     │  └─ AppLayout.tsx
│     └─ guards/
│        └─ RequireAuth.tsx
│
├─ pages/                  # 페이지 단위 (라우팅 기준)
│  ├─ home/
│  │  └─ Home2.tsx         # 홈 + 로그인 모달 제어
│  └─ book/
│     ├─ Booking.tsx
│     ├─ BookingConfirm.tsx
│     └─ PaySuccess.tsx
│
├─ widgets/                # 재사용 가능한 UI 블록
│  ├─ home2/
│  │  ├─ LoginSheet.tsx
│  │  ├─ HeroBubble.tsx
│  │  └─ PrimaryActions.tsx
│  └─ booking/
│     ├─ Calendar.tsx
│     └─ TimeGrid.tsx
│
├─ entities/               # 도메인 단위 로직
│  └─ auth/
│     └─ hooks/
│        └─ useAuth.ts     # mock 로그인 상태 관리
│
├─ shared/                 # 전역 유틸/훅/UI
│  ├─ ui/
│  │  ├─ LoadingBar.tsx
│  │  └─ DelayedFallback.tsx
│  ├─ hooks/
│  │  └─ timing/
│  └─ lib/
│     └─ datetime.ts
│
└─ main.tsx                # React DOM entry
```


## 핵심 파일
아래 파일들만 확인하실 수 있도록 정리했습니다.

### 앱 진입/Provider
- src/app/App.tsx
- src/app/providers/AppProviders.tsx

### 라우팅/레이아웃
- src/app/routes/index.tsx
- src/app/routes/layouts/AppLayout.tsx

### 로그인
- src/pages/home/Home2.tsx
- src/widgets/home2/LoginSheet.tsx
- src/entities/auth/hooks/useAuth.ts

### 예약 
- src/pages/book/Booking.tsx
- src/widgets/booking/Calendar.tsx (또는 TimeGrid.tsx)

---
