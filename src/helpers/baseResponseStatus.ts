const BaseResponseStatus: any = {
  //디폴트
  SUCCESS: { message: '성공' },
  ERROR: { message: '실패' },

  //로그인
  LOGIN_SUCCESS: { message: '로그인 성공'},
  LOGIN_FAIL: { message: '아이디 혹은 비밀번호가 잘못 되었습니다.' },
  SECRET_KEY_UNDEFINED: { message: "SECRET_KEY 환경 변수가 존재하지 않습니다." },
  JWT_TOKEN_NULL: { message: "로그인 토큰이 존재하지 않습니다." },
  JWT_FORBIDDEN: { message: "토큰이 유효하지 않습니다." }
};

export default BaseResponseStatus;
