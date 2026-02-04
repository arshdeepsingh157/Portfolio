export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("portfolio_admin") === "1";
};
