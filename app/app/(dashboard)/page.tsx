"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main>
      <div>
        {!session && (
          <Button asChild variant="default">
            <Link href={"/auth/login"}>Redirect to Login Page</Link>
          </Button>
        )}
        {session ? <p>Logged in</p> : <p>Not logged in</p>}
        {session && (
          <Button variant="destructive" onClick={() => signOut()}>
            Log out
          </Button>
        )}
      </div>
    </main>
  );
}
