# 디자인 시스템 가이드 (Design System DNA)

이 문서는 사용자의 UI/UX 취향과 피드백을 누적하여 기록하는 곳입니다.
에이전트는 새로운 디자인 시안을 제안하기 전, 반드시 이 파일의 내용을 확인해야 합니다.

## 1. 핵심 분위기 (Core Vibe)
- **Tech & Developer Friendly**: VS Code의 Atom One Dark 테마를 기반으로 한 다크 모드 지향.
- **Minimal & Clean**: 불필요한 장식을 배제하고 코드 에디터와 같은 정갈한 느낌 강조.

## 2. 레이아웃 규칙 (Layout Rules)
- **Top Tab Navigation**: 40px 높이의 상단 탭 바 (VS Code 스타일).
- **Max Width**: 메인 콘텐츠 영역은 최대 1200px 중앙 정렬 (단, 작성 탭은 전체 너비 활용).
- **Split View (WRITE Tab)**: 좌측 300px 사이드바, 우측 가변 에디터 영역.
- **Spacing & Padding**: 컨테이너 기본 패딩 20px, 요소 간 간격(gap) 20px.
- **Card/Container Style**: `border: 1px solid #181a1f`, `border-radius: 8px` 적용으로 영역 구분 명확화.

## 3. 색상 구성 (Color Palette) - Atom One Dark
- **Background**: `#282c34`
- **Header/Surface**: `#21252b`
- **Text (Main)**: `#abb2bf`
- **Text (Highlight)**: `#ffffff`
- **Accent (Active/Link)**: `#61afef`
- **Border**: `#181a1f`

## 4. 타이포그래피 (Typography)
- **Font Stack**: `Segoe UI`, Tahoma, sans-serif (시스템 폰트 위주).
- **Size**: Nav Tab (13px).

---
*최종 업데이트: 2026-05-24*
