const BaseResponseStatus: any = {
  //디폴트
  SUCCESS: { success: true, message: '성공' },
  ERROR: { success: false, message: '실패' },

  //로그인
  LOGIN_SUCCESS: { success: true, message: '로그인 성공'},
  LOGIN_FAIL: { success: false, message: '아이디 혹은 비밀번호가 잘못 되었습니다.' },

  //JWT
  SECRET_KEY_UNDEFINED: { success: false, message: "SECRET_KEY 환경 변수가 존재하지 않습니다." },
  JWT_TOKEN_NULL: { success: false, message: "로그인 토큰이 존재하지 않습니다." },
  JWT_FORBIDDEN: { success: false, message: "토큰이 유효하지 않습니다." },

  //회원가입
  SIGNUP_SUCCESS: { success: true, message: '회원가입 성공'},
  SIGNUP_DUPLICATE: { success: false, message: '이미 존재하는 아이디입니다.' }
};

export default BaseResponseStatus;
