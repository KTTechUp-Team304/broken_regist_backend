# broken_regist_backend

수강신청 기반 취약점 학습용 NestJS 백엔드입니다.

## 1) 팀원 온보딩: 사전 설치

아래 항목은 개발 시작 전에 로컬에 설치되어 있어야 합니다.

- `Node.js` 20+ (LTS 권장)
- `npm` 10+
- `Docker` + `Docker Compose` (PostgreSQL 실행용)
- 선택: `psql` (DB 직접 확인 시 유용)

## 2) 빠른 시작

```bash
# 1) 의존성 설치
npm install

# 2) 환경 변수 파일 생성
cp .env.example .env

# 3) PostgreSQL 실행
docker compose up -d postgres

# 4) 백엔드 실행
npm run start:dev
```

- API base path: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

## 3) 개발 기준 문서

도메인 개발 전 아래 문서를 반드시 먼저 확인합니다.

- `docs/api-list.txt`: 전체 API 목록과 역할(role) 정보
- `docs/api-docs.txt`: 요청/응답 상세, 공격 시나리오, 취약점 노출 포인트

개발 원칙:

- 기능 구현은 위 두 문서의 스펙을 우선 기준으로 맞춥니다.
- 각 도메인 모듈(`src/<domain>`) 단위로 구현/테스트를 진행합니다.
- 취약점 학습 목적(API별 취약 노출 시나리오)을 테스트에서 재현 가능한 상태로 유지합니다.

## 4) 권장 개발 흐름

각 도메인(`auth`, `users`, `courses`, `enrollments`, `files`, `admin`, `debug`, `system`, `logs`)에서 아래 순서로 진행합니다.

1. 문서(`api-list`, `api-docs`)로 요구사항 확인
2. 컨트롤러/서비스/DTO/엔티티 구현
3. Swagger 반영 (`@ApiOperation`, DTO 스키마 등)
4. 도메인별 e2e 테스트 추가 (`test/<domain>/<domain>.e2e-spec.ts`)
5. 정상 케이스 + 취약점 노출 케이스 모두 검증

## 5) 테스트 실행

### 전체 e2e 실행

```bash
npm run test:e2e
```

### 파일별 개별 실행

```bash
# 기본 앱 스모크 테스트
npm run test:e2e:app

# auth 도메인 테스트
npm run test:e2e:auth

# 임의 파일 지정 실행
npm run test:e2e:file -- test/auth/auth.e2e-spec.ts
npm run test:e2e:file -- test/app.e2e-spec.ts
```

새 도메인 테스트를 추가하면 동일하게 파일 경로만 바꿔서 개별 실행합니다.

예:

```bash
npm run test:e2e:file -- test/courses/courses.e2e-spec.ts
npm run test:e2e:file -- test/enrollments/enrollments.e2e-spec.ts
```

## 6) 현재 테스트 정책

- 기능 테스트: 정상 동작 검증
- 취약점 테스트: 문서에 정의된 취약 노출 시나리오 검증
- 목표: "기능이 된다" + "학습용 취약점이 의도대로 재현된다"를 함께 보장

## 7) 자주 쓰는 명령어

```bash
# 빌드
npm run build

# 린트 자동수정
npm run lint

# 코드 포맷
npm run format

# PostgreSQL 중지
docker compose down
```
