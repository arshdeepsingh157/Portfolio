export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("portfolio_admin") === "1";
};

export const syncAdminFromQuery = () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("admin") !== "1") return;
  window.localStorage.setItem("portfolio_admin", "1");
  params.delete("admin");
  const qs = params.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", next);
};
