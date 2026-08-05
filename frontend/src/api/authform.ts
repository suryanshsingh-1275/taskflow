import api from "./axios";
import type { SignupForm, LoginForm } from "../types/auth";

export const signup = (data: SignupForm) => {
    return api.post("/auth/signup", data);
};

export const login = (data: LoginForm) => {
    return api.post("/auth/login", data);
};