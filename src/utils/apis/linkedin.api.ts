export const buildLinkedinAuthUrl = (): string => {
  const base = "https://www.linkedin.com/oauth/v2/authorization";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID!,
    redirect_uri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI!,
    scope: import.meta.env.VITE_LINKEDIN_SCOPE!,
    state: import.meta.env.VITE_LINKEDIN_STATE!,
  });

  return `${base}?${params.toString()}`;
};
