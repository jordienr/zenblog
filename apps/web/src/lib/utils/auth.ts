export const publicPaths = ["/", "/sign-in*", "/sign-up*"];

export const isPublicPath = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};

export const getOAuthRedirectUrl = (path = "/sign-in") => {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
};
