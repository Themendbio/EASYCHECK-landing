# EasyCheck 웹사이트

Next.js App Router 기반 소개·응모·정책 사이트다. [next.config.js](next.config.js)의 `output: 'export'` 설정으로 정적 파일을 생성한다.

```sh
npm ci
npm run dev
npm run lint
npm run build
```

개발 화면은 `http://localhost:3000`, 빌드 결과는 `out/`이다. 명령·버전은 [package.json](package.json)과 lockfile을 따른다.

- 소개 화면은 `app/`, 공개 개인정보처리방침·탈퇴 안내는 `app/policy/`에서 관리한다. 오래된 Word 방침을 공개 정본으로 사용하지 않는다.
- API·행사 링크는 [event-config.js](lib/event-config.js), 폭염 API는 [Pages Function](functions/api/heatwave.js)이 기준이다. 후자는 Cloudflare 런타임의 `KMA_API_KEY`가 필요하다. Next 개발 서버만으로 이 함수를 실행한 것으로 보지 않는다. 비밀값을 정적 산출물에 넣지 않는다.
- 정책1.3의 10월2일 게시 기록과 운영 삭제 적용은 프로젝트 문서 저장소의 상태·RETENTION 절차를 따른다. 문서 수정이나 웹 빌드 성공은 게시 완료가 아니다.
- 배포 대상과 게시 상태는 실제 호스팅 설정·공개 응답으로 확인한다. 빌드 산출물 업로드는 별도 승인된 범위에서 진행한다.
- Next.js 변경 작업은 [AGENTS.md](AGENTS.md)를 따른다.
