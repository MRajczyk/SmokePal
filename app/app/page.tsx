import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { LoginButton, LogoutButton } from "@/components/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <LoginButton />
      &nbsp;
      <LogoutButton />
      <p className="font-poppins">Hello world, yes!</p>
      <pre>{JSON.stringify(session)}</pre>
      {session ? <p>Logged in</p> : <p>Not logged in</p>}
    </main>
  );
}
