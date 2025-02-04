import { $userMetadata, renderGoogleLoginButton } from "../lib";
import { useStore } from "@nanostores/react";
import { logout } from "../lib";
import type { UserMetadata } from "../lib";
import { useEffect, useLayoutEffect } from "react";
import "./Profile.css";

type ProfileMenuProps = {
  initialUser?: UserMetadata;
};

export default function ProfileMenu({ initialUser }: ProfileMenuProps) {
  const clientSideUser = useStore($userMetadata);
  // If there's no client side user information (the store isn't populated yet),
  // render the user identity provided by the server. If the user is already
  // logged in, the rerender will be a noop when the store is populated. However
  // if the user logs in after the initial render, that will populate the store
  // and the correct client side user will be rendered.
  const user = clientSideUser === undefined ? initialUser : clientSideUser;
  useEffect(() => {
    // this should only run once, after client side hydration
    if (clientSideUser === undefined && initialUser !== undefined) {
      $userMetadata.set(initialUser);
    }
    // initialUser can't change because it comes from an Astro component, but
    // React still needs to think it can because it's a dependency of the effect
  }, [clientSideUser, initialUser]);
  // This runs synchronously after the render creates the DOM element used to
  // house the Google Sign In button
  useLayoutEffect(() => {
    if (!user) {
      const target = document.getElementById("loggedOut");
      if (target) renderGoogleLoginButton(target);
    }
  });
  return user ? (
    <>
      <div id="loggedIn">
        {" "}
        hello <b>{user.name}</b>, looking good today!
      </div>
      <button
        onClick={() => {
          logout();
        }}
      >
        log out{" "}
      </button>
    </>
  ) : (
    <div id="loggedOut">sign in button skeleton here</div>
  );
}
