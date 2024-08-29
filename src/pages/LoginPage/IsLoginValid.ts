type loginPayloadType = {
  email: string | undefined;
  password: string | undefined;
};

export const isLoginValid = (loginPayload: loginPayloadType) => {
  const { email, password } = loginPayload;

  if (!email && !password) alert("값을 입력해주세요");
  else if (!email) alert("이메일을 입력해주세요");
  else if (!password) alert("비밀번호를 입력해주세요");
  if (email && password) {
    return true;
  }
  return false;
};
