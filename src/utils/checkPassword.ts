export const validatePasswordStrength = (password: string) => {
  let message = "弱密码";
  let tips = "";
  if (password.length < 8) {
    message = "弱密码";
    tips = "密码长度小于8位";
  }

  let charTypesCount = 0;

  if (/[A-Z]/.test(password)) {
    charTypesCount++;
  } else {
    tips = "缺少大写字母";
  }

  if (/[a-z]/.test(password)) {
    charTypesCount++;
  } else {
    tips = "缺少小写字母";
  }

  if (/[0-9]/.test(password)) {
    charTypesCount++;
  } else {
    tips = "缺少数字";
  }

  if (/[\W_]/.test(password)) {
    charTypesCount++;
  } else {
    tips = "缺少特殊字符";
  }
  if (charTypesCount === 2) {
    message = "中密码";
  } else if (charTypesCount === 3) {
    message = "强密码";
  } else if (charTypesCount === 4) {
    message = "极强密码";
  }

  return {
    message,
    tips
  };
};
