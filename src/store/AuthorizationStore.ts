import { Authorization } from "@/types/Authorization";
import { BehaviorSubject } from "rxjs";

export const AuthorizationState = new BehaviorSubject<Authorization>({});

export const isAuthenticated = (): boolean => {
  return !!AuthorizationState.value?.isAuth;
};
