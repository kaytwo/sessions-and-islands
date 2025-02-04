import { ActionError } from "astro/actions/runtime/virtual/shared.js";
import { getActionContext } from "astro:actions";
import { defineMiddleware } from "astro:middleware";
import type { UserMetadata } from "./lib";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || context.url.pathname === "/_image") {
    return next();
  }

  const actionContext = getActionContext(context);
  context.locals.user = await context.session?.get<UserMetadata>("user");

  // all on-demand routes besides signIn and the SignInMenu server island
  // require login.
  // Note: Do not use middleware for all access control![1] This is just a first
  // pass that ensures a valid user is logged in for baseline functionality. You
  // should enforce any meaningful access control per-route. If you consider
  // adding more on-demand routes for non-logged-in users, you should move this
  // check out of the middleware.
  //
  // 1. https://pilcrowonpaper.com/blog/middleware-auth/
  if (
    !context.locals.user &&
    actionContext?.action?.name !== "signIn/" &&
    context.url.pathname !== "/_server-islands/SignInMenu"
  ) {
    // These routes aren't URL bar routes, so redirect doesn't make sense here
    if (
      actionContext?.action ||
      context.routePattern === "/_server-islands/[name]"
    ) {
      throw new ActionError({
        message: "You must be logged in to access this page",
        code: "UNAUTHORIZED",
      });
    }
    return context.redirect("/");
  }
  return next();
});
