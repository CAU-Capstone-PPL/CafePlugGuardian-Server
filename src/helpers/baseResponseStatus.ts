const BaseResponseStatus: any = {
  //디폴트
  SUCCESS: { message: '성공' },
  ERROR: { message: '실패' },

  //로그인
  LOGIN_SUCCESS: { message: '로그인 성공'},
  LOGIN_FAIL: { message: '아이디 혹은 비밀번호가 잘못 되었습니다.' },
};

export default BaseResponseStatus;
