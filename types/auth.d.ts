export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  username: string;
  email: string;
  password: string;
  nickname: string;
}

export interface IForgotPassword {
  email: string;
  password: string;
}
