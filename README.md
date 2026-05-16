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

# 4) 목데이터 적용 (교수·강의 시드, 최초 1회)
docker compose exec -T postgres psql -U broken_regist -d broken_regist \
  < docs/seed-mock-data.sql

# 5) 백엔드 실행
npm run start:dev
```

- API base path: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api-docs`

## 3) 목데이터(시드)

회원가입으로는 `student`만 생성됩니다. **교수·관리자 계정과 강의**는 DB 시드로 미리 넣습니다.

`professors.user_id`는 `users.id`를 참조하므로, 시드는 아래 순서로 **세 테이블 모두** 채웁니다.

```
users (role=professor|admin)  →  professors (user_id FK)  →  courses (professor_id FK)
```

- 시드 파일: [`docs/seed-mock-data.sql`](docs/seed-mock-data.sql)
- 스키마 참고: [`docs/course-registration-erd-v1.sql`](docs/course-registration-erd-v1.sql) (TypeORM `synchronize=true` 사용 시 테이블은 앱 기동 시 자동 생성)

### 적용

PostgreSQL 컨테이너가 떠 있는 상태에서:

```bash
docker compose exec -T postgres psql -U broken_regist -d broken_regist \
  < docs/seed-mock-data.sql
```

### 포함 데이터

| 테이블 | 개수 | 내용 |
|--------|------|------|
| `users` | 6 | 교수 5 (`role=professor`) + 관리자 1 (`role=admin`) — 로그인 계정 |
| `professors` | 5 | `user_id`로 위 교수 `users` 행과 1:1 연결, `name`·`department_name` |
| `courses` | 15 | 노출 10 + 숨김 실습 5 (`is_visible`) |

교수로 로그인하려면 `users` 행이 있어야 하고, 강의 목록에 교수 정보가 붙으려면 `professors` 행이 있어야 합니다. 시드 SQL은 이 관계를 한 번에 맞춥니다.

### 로그인 계정

비밀번호는 평문을 SHA-256(hex)한 값을 DB에 저장합니다 (`AuthService`와 동일).

| username | role | 비밀번호(평문) |
|----------|------|----------------|
| `prof.kim` | professor | `prof123` |
| `prof.lee` | professor | `prof123` |
| `prof.park` | professor | `prof123` |
| `prof.choi` | professor | `prof123` |
| `prof.jung` | professor | `prof123` |
| `admin` | admin | `admin123` |

### 교수·강의 요약

| username | 교수명 | 학과 | 노출 강의 | 숨김 실습 |
|----------|--------|------|-----------|-----------|
| `prof.kim` | 리누스 토발즈 | 컴퓨터공학과 | CS101, CS201 | CS999 |
| `prof.lee` | 앨런 튜링 | 컴퓨터공학과 | MATH101, MATH201 | CS998 |
| `prof.park` | 그레이스 호퍼 | 컴퓨터공학과 | EE101, EE201 | CS997 |
| `prof.choi` | 데니스 리치 | 컴퓨터공학과 | BUS101, BUS201 | CS996 |
| `prof.jung` | 도널드 커누스 | 컴퓨터공학과 | HUM101, CS520 | CS995 |

**합계:** 노출 10개 · 숨김 실습 5개 (`is_visible = false`)

실습용 예시:

- `CS201`: 정원 만원 (`current_count = max_capacity`)
- `CS999` ~ `CS995`: 숨김 실습 강의 (`is_visible = false`)

### 재적용

같은 계정으로 다시 넣으면 `username` unique 오류가 납니다. `docs/seed-mock-data.sql` 상단 **cleanup** 블록 주석을 해제한 뒤 실행하세요.

## 4) 개발 기준 문서

도메인 개발 전 아래 문서를 반드시 먼저 확인합니다.

- `docs/api-list.txt`: 전체 API 목록과 역할(role) 정보
- `docs/api-docs.txt`: 요청/응답 상세, 공격 시나리오, 취약점 노출 포인트
- `docs/vulnerability-matrix.md`: **팀원용** API×취약점 매트릭스 (구현 여부·페이로드 예시)
- `docs/seed-mock-data.sql`: 교수·강의 목데이터 시드
- `docs/course-registration-erd-v1.sql`: PostgreSQL 스키마 정의

개발 원칙:

- 기능 구현은 위 두 문서의 스펙을 우선 기준으로 맞춥니다.
- 각 도메인 모듈(`src/<domain>`) 단위로 구현/테스트를 진행합니다.
- 취약점 학습 목적(API별 취약 노출 시나리오)을 테스트에서 재현 가능한 상태로 유지합니다.

## 5) 권장 개발 흐름

각 도메인(`auth`, `users`, `courses`, `enrollments`, `files`, `professors` 엔티티, `logs` 엔티티 등)에서 아래 순서로 진행합니다.

1. 문서(`api-list`, `api-docs`)로 요구사항 확인
2. 컨트롤러/서비스/DTO/엔티티 구현
3. Swagger 반영 (`@ApiOperation`, DTO 스키마 등)
4. 도메인별 e2e 테스트 추가 (`test/<domain>/<domain>.e2e-spec.ts`)
5. 정상 케이스 + 취약점 노출 케이스 모두 검증

## 6) 테스트 실행

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

## 7) 현재 테스트 정책

- 기능 테스트: 정상 동작 검증
- 취약점 테스트: 문서에 정의된 취약 노출 시나리오 검증
- 목표: "기능이 된다" + "학습용 취약점이 의도대로 재현된다"를 함께 보장

## 8) 자주 쓰는 명령어

```bash
# 빌드
npm run build

# 린트 자동수정
npm run lint

# 코드 포맷
npm run format

# PostgreSQL 중지
docker compose down

# 목데이터 재적용 (cleanup 주석 해제 후)
docker compose exec -T postgres psql -U broken_regist -d broken_regist \
  < docs/seed-mock-data.sql
```
