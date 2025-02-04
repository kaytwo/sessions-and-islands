import {
  type ActionAPIContext,
  ActionError,
  defineAction,
} from "astro:actions";
import { z } from "astro:schema";
import { GOOGLE_CLIENT_ID } from "astro:env/client";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { UserMetadata } from "../stores";

interface GoogleJwtPayload {
  email: string;
  sub: string;
  name: string;
  picture: string;
}

const verifyGoogleJWT = async (jwt: string) => {
  const JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs"),
  );
  const { payload } = await jwtVerify<GoogleJwtPayload>(jwt, JWKS, {
    issuer: "https://accounts.google.com",
    audience: GOOGLE_CLIENT_ID,
  });
  return payload;
};

async function logout(_: unknown, context: ActionAPIContext) {
  context.session?.destroy();
}

const signInArgsSchema = z.object({ idToken: z.string() });
type SignInArgs = z.TypeOf<typeof signInArgsSchema>;

async function signIn(input: SignInArgs, context: ActionAPIContext) {
  try {
    // this throws if the JWT is invalid.
    const claims = await verifyGoogleJWT(input.idToken);
    await context.session?.regenerate();
    if (!context.session) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Session regeneration failed, please try again",
      });
    }
    const currentUser = {
      googleId: claims.sub,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
    } as UserMetadata;

    // Here you should probably check your user db for the user, and do any
    // updates needed. In this example we just set the session info server side.
    context.session.set<UserMetadata>("user", currentUser);
    return currentUser;
  } catch (error) {
    console.error(error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "login failure, please try again",
    });
  }
}

export const server = {
  logout: defineAction({
    handler: logout,
  }),
  signIn: defineAction({
    input: signInArgsSchema,
    handler: signIn,
  }),
};
