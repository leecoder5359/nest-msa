## 프로젝트 아키텍쳐

- 응집도 높은 모듈 설계
- 프로덕트 레벨의 서버 사이드 기능 구현
- Github Actions를 활용한 운영 환경 배포
  ![Alt text](./diagram/img/architecture.svg?raw=true)

## 주요 기능
- 회원가입 및 로그인
- 슬라이딩 세션과 리프레쉬 토큰을 활용하여 인증 과정 디벨롭
- Authorizaion(인가) 구현을 통해 유저의 롤에 따른 API 접근
- 비디오 업로드 및 재생, 데이터 확인 API, 비즈니스 로직 작성
- Decorator 활용
- Provider 활용
- Module 활용
- Interceptor를 활용한 요청, 응답 매핑
- TypeORM을 활용하여 Transaction, Index 구현
- 쿼리 분석 및 개선
- Task 스케쥴링을 활용한 메일 전송
- 에러 발생시 슬랙 알람 전송
- 테스트 케이스 작성
- Github Actions를 활용한 CD
  ![Alt text](./diagram/img/sequence.svg?raw=true)

## 기술 스택

- Typescript 4.9.5
- Node.js 18.18.0
- NestJS 10.2.1
- Postgres 14.6
- Docker
- Git, Github

## 업데이트 예정 목록
- NestJS 마이크로서비스 적용
- docker compose를 활용하여 로컬 개발 환경에서 마이크로서비스 세팅
- docker compose를 활용하여 Postgres, Kafka 세팅
- TCP를 활용한 동기 통신
- Kafka를 활용한 비동기 통신
> 참고: [develop/msa-convert 브랜치](https://github.com/leecoder5359/nest-msa/tree/develop/msa-convert)
