export const cleanExpiredUserMeta = () => {
  const expiry = localStorage.getItem("user_meta_expiry");
  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem("user_id");
    localStorage.removeItem("realm_id");
    localStorage.removeItem("user_meta_expiry");
  }
};
