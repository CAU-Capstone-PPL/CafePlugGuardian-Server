interface IBaseResponseStatus {
  status: number;
  success: boolean;
  message: string;
}

const BaseResponseStatus: any = {
  //디폴트
  SUCCESS: { status: 200, success: true, message: '성공' },
  ERROR: { status: 400, success: false, message: '실패' },

  //TODO status
  TODO_SUCCESS: { status: 200, success: true, message: '성공, response 미구현' },
  TODO_ERROR: { status: 400, success: false, message: '실패, response 미구현' },

  //로그인
  LOGIN_SUCCESS: { status: 200, success: true, message: '로그인 성공'},
  LOGIN_FAIL: { status: 400, success: false, message: '아이디 혹은 비밀번호가 잘못 되었습니다.' },

  //JWT
  SECRET_KEY_UNDEFINED: { status: 400, success: false, message: 'SECRET_KEY 환경 변수가 존재하지 않습니다.' },
  JWT_TOKEN_NULL: { status: 400, success: false, message: '로그인 토큰이 존재하지 않습니다.' },
  JWT_FORBIDDEN: { status: 400, success: false, message: '토큰이 유효하지 않습니다.' },

  //회원가입
  SIGNUP_SUCCESS: { status: 200, success: true, message: '회원가입 성공' },
  SIGNUP_DUPLICATE: { status: 400, success: false, message: '이미 존재하는 아이디입니다.' },

  //플러그
  UNKNOWN_PLUG: { status: 400, success: false, message: '존재하지 않은 플러그입니다.' }
};

export { IBaseResponseStatus, BaseResponseStatus };
