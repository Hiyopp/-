type joinPayloadType = {
  nickname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  reCheckPw: string | undefined;
};

export function isJoinValid(joinPayload: joinPayloadType) {
  const { nickname, email, password, reCheckPw } = joinPayload;

  if (!nickname && !email && !password && !reCheckPw)
    alert("값을 입력해주세요");
  else if (!nickname) alert("닉네임을 입력해주세요");
  else if (!email) alert("email을 기입해주세요");
  else if (!password) alert("비밀번호를 입력해주세요");
  else if (!reCheckPw) alert("비밀번호를 재확인해주세요");
  else if (password !== reCheckPw) alert("비밀번호 재확인이 되지 않았습니다.");
  if (email && password === reCheckPw) {
    joinPayload.email = email;
    joinPayload.password = password;
    return true;
  }
  return false;
}
