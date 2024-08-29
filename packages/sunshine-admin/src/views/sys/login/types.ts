export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

export interface LoginField {
  account: string;
  password: string;
}
export interface RestPasswordField {
  account: string;
  sms: string;
  mobile: string;
}
export interface MobileField {
  mobile: string;
  sms: string;
}

export interface RegisterField {
  account: string;
  mobile: string;
  sms: string;
  password: string;
  confirmPassword: string;
  policy: string;
}
