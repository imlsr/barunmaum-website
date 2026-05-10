# 서울바른마음치과 홈페이지

서울 시흥동 [서울바른마음치과](https://bamadental.co.kr/) 공식 홈페이지.

정적 HTML / CSS / JS — 빌드 도구 없음.

## 시작하기

```sh
npm install     # 첫 1회만
npm run dev     # http://localhost:8080  (파일 저장 시 자동 새로고침)
```

`npm install`이 끝나면 `npm run dev`로 라이브 서버가 뜨고, `index.html` / `style.css` / `main.js`를 저장할 때마다 브라우저가 자동으로 새로고침됩니다.

## 명령어

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Live Server (포트 8080, 자동 새로고침) |
| `npm run format` | Prettier로 전체 포맷 |
| `npm run format:check` | 포맷 검사만 (수정 X) |

## 폴더 구조

```
.
├── index.html       # 메인 페이지
├── style.css        # 디자인 시스템 토큰 + 섹션 스타일
├── main.js          # Lenis 부드러운 스크롤 + Hero 카드 변환 + Reveal
├── assets/          # 이미지·비디오
│   ├── s02_thum/    # S02 진료 카드 6개
│   └── video/       # Hero 비디오
├── .claude/         # Claude Code 환경 설정 (launch.json 등)
└── .vscode/         # 추천 확장 + 워크스페이스 설정
```

## 디자인 기준

- 데스크톱 1920px / 컨테이너 max-width 1400px
- 반응형 BP: 1400 / 1024 / 768 / 480
- 폰트: Pretendard (한글) + Outfit (영문 헤드라인)
- 디자인 시스템 토큰은 `style.css` 상단 `:root`에 1:1 매핑

## 추천 VS Code / Cursor 확장

`.vscode/extensions.json`에 등록되어 있어 워크스페이스를 열면 자동으로 추천됩니다.

- **Prettier** — 저장 시 자동 포맷
- **Live Server** — 내장 라이브 서버 (대안)
- **EditorConfig** — `.editorconfig` 적용
- **Auto Rename Tag** — HTML 태그 짝 자동 변경
- **Color Highlight** — CSS 색상값 인라인 미리보기
