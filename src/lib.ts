import { actions } from "astro:actions";
import { GOOGLE_CLIENT_ID } from "astro:env/client";
import { atom } from "nanostores";

// Because this is a simple demo, export from here. In a real project,
// you should probably define this in a lib/types.ts or similar.
export type UserMetadata = {
  name: string;
  email: string;
  googleId: string;
  picture: string;
};

// module scoped state to keep track of the island's URL
let islandToInvalidate = undefined as string | undefined;

// undefined - not yet loaded, null - logged out
export const $userMetadata = atom<UserMetadata | undefined | null>(undefined);

async function handleCredentialResponse(
  response: google.accounts.id.CredentialResponse,
) {
  const { data, error } = await actions.signIn({
    idToken: response.credential,
  });
  if (error) {
    console.error(error);
    return;
  }
  // this request invalidates the cached "user is not signed in" island
  // response, so the next request for the SignInMenu server island will give a
  // logged in response containing user metadata, and then be cached as the
  // initial source of user metadata on the page.
  await invalidateIsland();
  $userMetadata.set(data);
}

export async function renderGoogleLoginButton(target: HTMLElement) {
  await gsiLoadPromise;
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(target, {
    theme: "outline",
    size: "large",
    type: "standard",
  });
}

export async function logout() {
  const { error } = await actions.logout();
  if (error) {
    console.error("Error signing out:", error);
  }
  // send a no-cache request that invalidates the disk-cached login status
  await invalidateIsland();
  $userMetadata.set(null);
  // In a real app, you'd probably have more than one route, so you'd want to
  // redirect to the homepage or login page after a user logs out. In an MPA you
  // can do window.location.href = "/", or in an SPA you can use `import {
  // navigate } from "astro:transitions/client";` and `navigate("/")` to get the
  // user back to the home page/desired page. For this one route SPA demo, we
  // don't redirect anywhere.
}

async function invalidateIsland() {
  // this could probably use some error handling
  if (islandToInvalidate) {
    await fetch(islandToInvalidate, {
      headers: { "Cache-Control": "no-cache" },
    });
  }
}

export function setLogoutUrl(url: string) {
  islandToInvalidate = url;
}
