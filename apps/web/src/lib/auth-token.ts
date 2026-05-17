const ACCESS_TOKEN_KEY = "access_token";

export const saveAccessToken = (token: string) => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  document.cookie = `access_token=${token}; path=/; max-age=900; SameSite=Lax`;
};

export const clearAccessToken = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
};
