"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        signIn();
      }}
    >
      Sign In
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
};
