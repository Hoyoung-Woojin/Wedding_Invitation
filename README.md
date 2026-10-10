# 모바일 청첩장 V2 초안

## V1 보호
V1 저장소 `H o y o u n g - W o o j i n / wedding-invitation`에 이 파일을 덮어쓰지 마세요. 별도 저장소 `Wedding_Invitation`를 생성하여 배포합니다.

## 적용 범위
- 커버: 제공된 웨딩 원본 사진을 `images/cover-photo.jpg`로 적용, 세이지/올리브/아이보리 테마
- Gallery 다음: 화환 안내 섹션 추가 (문구는 제공한 세 번째 이미지 기준)
- 엔딩: 제공된 픽셀 일러스트로 교체
- RSVP: 기존 Google Apps Script 설정, 입력·집계·중복 처리 그대로 재사용. 입력 모달은 색상만 변경
- 시각 효과: 기존 snow.js 대신 leaf.js, 커버/혼주/모시는 글까지만
- 공유: V1과 같은 OG 제목/설명/이미지 URL. V2 자체 공유 링크는 별도.

## 아직 필요한 V1 자산
원본 대화에 없는 파일은 일부러 만들어 넣지 않았습니다. V1 저장소에서 다음을 V2의 같은 위치에 복사하세요:
- `accounts.js`: 계좌 섹션 실행에 필수
- `images/01.jpg` ~ `images/18.jpg`: 갤러리 사진
- 그 밖에 V1 images 폴더 내 필요한 리소스

카카오톡 OG 이미지 주소는 V1의 공개 이미지 `https://hoyoung-woojin.github.io/wedding-invitation/images/thumbnail_v2.jpg`를 동일하게 참조하도록 설정했습니다. 같은 썸네일을 쓰기 위해 V2에 사진 파일을 중복 저장하지 않아도 됩니다. V1 이미지 URL을 앞으로 바꾸면 V2 OG도 함께 수정해야 합니다.

## 신규 GitHub 저장소
1. `Hoyoung-Woojin/Wedding_Invitation` 새 public 저장소 생성 (예시 이름; 다르면 코드 URL도 수정)
2. ZIP 안 파일 + V1에서 복사할 `accounts.js`와 gallery images를 저장소 루트에 업로드
3. Settings → Pages → Deploy from a branch → main / (root) 설정
4. Actions 배포 완료 확인
5. 사이트 `https://hoyoung-woojin.github.io/Wedding_Invitation/` 검증
6. 카카오톡 공유 테스트 / 모바일 RSVP 실험 테스트 (실제 응답은 V1 동일 시트로 저장됨)

## 배포 전 주의
- 실제 도메인/저장소가 아직 생성되지 않은 상태이므로 링크는 제안한 저장소 이름 기준의 초안입니다.
- 이번 패키지는 정적 코드와 이미지 준비본이며 실제 iPhone/Android, 카카오톡 전송, Google Apps Script 저장 테스트는 수행하지 않았습니다.
- `config.js`에는 기존 RSVP 연동 URL이 포함되어 있습니다. 공개 웹 앱 권한과 제출 보안 설정을 기존과 같이 확인하세요.
