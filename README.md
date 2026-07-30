# 2026 전국증경회장단모임 안내 페이지

모바일 중심의 행사 안내 및 숙소 조회 페이지입니다. GitHub Pages에서 운영할 수 있습니다.

## 바로 확인하기

`index.html`을 브라우저에서 열고, 샘플 성함 `김한별`을 입력하면 전체 흐름을 확인할 수 있습니다.

## 자주 수정하는 항목

`config.js`에서 다음 내용을 변경합니다.

- 행사 일자와 장소
- 울산YWCA 인스타그램 주소
- 울산YWCA 카카오채널 주소
- 일정표 주소
- 울산 12경 주소
- Google Apps Script 웹 앱 주소

## Google Sheets 연동

1. 새 Google Sheet를 만들고 시트 이름을 `참가자`로 지정합니다.
2. `google-apps-script/참가자_시트_예시.csv`와 같은 제목으로 데이터를 입력합니다.
3. Google Sheet에서 `확장 프로그램 → Apps Script`를 엽니다.
4. `google-apps-script/Code.gs`의 코드를 붙여 넣고 저장합니다.
5. `배포 → 새 배포 → 웹 앱`을 선택합니다.
6. 실행 사용자는 본인, 액세스 권한은 웹 조회가 가능한 범위로 설정하고 배포합니다.
7. 배포된 웹 앱 주소를 `config.js`의 `API_URL`에 입력합니다.
8. `DATA_MODE`를 `"google-sheet"`로 변경합니다.

시트 열은 `ID | 이름 | 지역 | 호실 | 룸메이트` 순서입니다. 룸메이트가 여러 명이면 쉼표로 구분합니다.

## 캐릭터 이미지 교체

- 메인 환영 연이: `assets/yeoni-welcome.png`
- 플로팅 얼굴 연이: `assets/yeoni-face.png`

같은 파일명으로 교체하거나 `index.html`의 이미지 주소를 변경하면 됩니다.

## GitHub Pages 배포

저장소의 `Settings → Pages`에서 배포 브랜치와 루트 폴더를 선택합니다. 잠시 후 제공되는 주소로 접속할 수 있습니다.

## 링크 공유 썸네일

공유용 이미지는 `assets/og-image.png`이며 권장 규격인 1200×630px로 제작되어 있습니다. `index.html`의 Open Graph 정보는 아래 주소를 기준으로 설정되어 있습니다.

`https://ulsanywca.github.io/2026YWCA/`

카카오톡에 이전 미리보기가 계속 나타나면 Kakao Developers의 공유 디버거에서 해당 주소의 캐시를 초기화합니다.

## 개인정보 참고

실제 명단은 `sample-data.js`에 넣지 않고 Google Sheet에만 보관하는 것을 권장합니다. 이름만으로 조회하는 방식은 행사 편의성에 맞춘 기본 구조입니다. 필요하면 휴대전화 뒤 4자리 등 추가 확인값을 붙일 수 있습니다.
