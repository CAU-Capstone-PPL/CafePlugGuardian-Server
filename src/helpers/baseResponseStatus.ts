interface IBaseResponseStatus {
  status: number;
  success: boolean;
  message: string;
}

const BaseResponseStatus: any = {
  //디폴트
  SUCCESS: { status: 200, success: true, message: '성공' },
  ERROR: { status: 400, success: false, message: '실패' },
  NOT_FOUND: { status: 404, success: false, message: '404 Not Found' },
  SERVER_ERROR: { status: 500, success: false, message: 'Internal Server Error' },
  IMPOSSIBLE_ERROR: { status: 500, success: false, message: '오류가 터지면 안되는 상황에 오류가 발생했습니다.' },

  //TODO status
  TODO_SUCCESS: { status: 200, success: true, message: '성공, status, response 임시응답' },
  TODO_ERROR: { status: 400, success: false, message: '실패, status, response 임시응답' },

  //로그인
  LOGIN_SUCCESS: { status: 200, success: true, message: '로그인 성공' },
  LOGIN_ACCOUNT_NOT_FOUNT: { status: 404, success: false, message: '존재하지 않은 아이디입니다.' },
  LOGIN_FAIL: { status: 401, success: false, message: '아이디 혹은 비밀번호가 잘못 되었습니다.' },

  //JWT
  SECRET_KEY_UNDEFINED: { status: 500, success: false, message: 'SECRET_KEY 환경 변수가 존재하지 않습니다.' },
  JWT_TOKEN_NULL: { status: 401, success: false, message: '로그인 토큰이 존재하지 않습니다.' },
  JWT_FORBIDDEN: { status: 403, success: false, message: '토큰이 유효하지 않습니다.' },

  //회원가입
  SIGNUP_SUCCESS: { status: 200, success: true, message: '회원가입 성공' },
  SIGNUP_DUPLICATE: { status: 403, success: false, message: '이미 존재하는 아이디입니다.' },

  //플러그
  UNKNOWN_PLUG: { status: 404, success: false, message: '존재하지 않은 플러그입니다.' },
  NOT_CONNECTED_PLUG: { status: 403, success: false, message: '연결되지 않은 플러그입니다.' },
  USED_PLUG: { status: 400, success: false, message: '이미 사용 중인 플러그 입니다.' },
  NOT_USED_PLUG: { status: 400, success: false, message: '사용 중이지 않은 플러그입니다.' },
  OFFLINE_PLUG: { status: 400, success: false, message: '전원이 연결되지 않았거나 네트워크 문제가 있는 플러그입니다.' },

  //PIN
  UNKNOWN_PIN: { status: 403, success: false, message: 'PIN 번호가 유효하지 않습니다.' },

  //카페
  UNKNOWN_CAFE: { status: 404, success: false, message: '존재하지 않은 카페입니다.' },

  //마일리지
  REQUIRE_MENU_CONDITION: { status: 400, success: false, message: 'cafeId 또는 plugId가 필요합니다.' },
  UNKNOWN_MENU: { status: 404, success: false, message: '존재하지 않은 상품입니다.' },
  NOT_ENOUGH_MILEAGE: { status: 403, success: false, message: '마일리지가 부족합니다.' },

  //로그
  UNKNOWN_PLUG_OFF_LOG: { status: 404, success: false, message: '존재하지 않은 플러그 강제 종료 로그입니다.' }
};

export { IBaseResponseStatus, BaseResponseStatus };
