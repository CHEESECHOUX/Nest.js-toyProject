# Nest.js-toyProject
공식문서를 기반으로 구현한 토이 프로젝트

- 팀원 : 1명
- 사용 언어 및 프레임워크 : TypeScript, Nest.js, TypeORM
- Database : MySQL
<br/>

# 💡 고민했던 점
1. 공식문서에 있는 예시 code와 최대한 동일하게 프로젝트 세팅<br/>
logging, exception filter, validation pipe, cors, config(dotenv)<br/>

- 관련 블로그 : [ValidationPipe - whitelist](https://velog.io/@cheesechoux/Nest.js-ValidationPipe-whitelist-%EC%97%90%EB%9F%AC%EB%A5%BC-%EC%9E%A1%EC%95%84%EB%B3%B4%EC%95%84%EC%9A%94)
<br/>

2. Nest.js에서 제공하는 의존성주입 이해<br/>
Repository는 InjectRepository, DataSource 총 두 가지의 방법으로 구현 가능하지만, 공식문서에 나와있는 InjectRepository로 구현
- 관련 블로그 : [Repository(TypeORM)](https://velog.io/@cheesechoux/Nest.js-typeorm-0.3.x-EntityRepository-%EC%9D%91-%EC%9D%B4%EC%A0%9C-%EB%AA%BB%EC%8D%A8%EC%9A%94)
<br/>

3. 테스트용 MySQL 연결 (.env 환경분리)<br/>
mocking으로 구현했던 Database를 테스트용 Database를 연결해 리팩토링
- 관련 블로그 : [mocking했던 bcrypt.compare 함수 수정하기](https://velog.io/@cheesechoux/Jest-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%9A%A9-DB-%EC%97%B0%EA%B2%B0-%ED%9B%84-mocking%ED%96%88%EB%8D%98-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%BD%94%EB%93%9C-%EC%88%98%EC%A0%95%ED%95%98%EA%B8%B0)
<br/>
  
# 📡 API
### [API Documentation](https://documenter.getpostman.com/view/20782433/2s93sjU8jU)

|기능|EndPoint|메소드|
|:---|:---|:---:|
|회원가입|/users/signup|POST|
|로그인|/users/login|POST|
|사용자 본인 정보조회|/users/me|GET|
