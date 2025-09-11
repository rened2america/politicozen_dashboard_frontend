import { useMutation } from "@tanstack/react-query";
import axios from "../../service/axiosInstance";

type LoginData = {
  email: string;
  password: string;
};

type ForgotPasswordData = {
  email: string;  
};

type ResetPasswordData = {
  email: string;  
  password: string;  
  token: string;  
};

const postUserData = async (data: LoginData) => {
  const res = await axios.post("auth/login", data).then((res) => {
    return res;
  });

  return res;
};

const postForgotPassword = async (data: ForgotPasswordData) => {
  const res = await axios.post("auth/requestPasswordReset", data).then((res) => {
    return res;
  });

  return res;
};

const postResetPassword = async (data: ResetPasswordData) => {
  const res = await axios.post("auth/resetPassword", data).then((res) => {
    return res;
  });

  return res;
};
const postResetPasswordWhileLoggedIn = async (data: ResetPasswordData) => {
  const res = await axios.post("auth/resetPasswordIn", data).then((res) => {
    return res;
  });

  return res;
};


export const useUserLogin = () => {
  return useMutation((data: LoginData) => postUserData(data), {});
};

export const useForgotPassword = () => {
  return useMutation((data: ForgotPasswordData) => postForgotPassword(data), {});
};

export const useResetPassword = () => {
  return useMutation((data: ResetPasswordData) => postResetPassword(data), {});
};

export const useResetPasswordWhileLoggedIn = () => {
  return useMutation((data: ResetPasswordData) => postResetPasswordWhileLoggedIn(data), {});
};