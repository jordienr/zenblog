export const publicPaths = ["/", "/sign-in*", "/sign-up*"];

export const isPublicPath = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};
