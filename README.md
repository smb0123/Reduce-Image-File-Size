# 사진 용량 줄이기 (React + Vite)

브라우저 안에서만 동작하는 이미지 압축/리사이즈/형식 변환 도구입니다. 서버가 필요 없습니다.

## 실행
    npm install
    npm run dev       # 개발 서버
    npm run build     # dist/ 폴더 생성 (이 폴더를 배포)

## 배포
- Vercel / Netlify / Cloudflare Pages: 저장소 연결 후 Build command `npm run build`, Output `dist`
- GitHub Pages 등: `dist/` 안의 파일을 그대로 업로드

## 폴더 구조
    src/
      main.jsx                  진입점 (CSS 불러오기)
      App.jsx                   전체 조립
      constants.js              옵션 목록, 기본 설정, 1MB 상수
      components/               화면 컴포넌트
        settings/               설정 패널의 세부 입력 컴포넌트
      hooks/useImageQueue.js    파일 목록, 변환 큐, 삭제 등 상태 로직
      utils/
        imageProcessor.js       크기 계산, 캔버스 그리기, 압축 (화면과 무관한 순수 로직)
        format.js               용량 표시, 출력 파일명
        zip.js                  ZIP 다운로드
      styles/                   theme(색) / base(기본) / layout(배치) / components(부품)
