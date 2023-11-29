import Provider from "../context/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Provider session={session}>{children}</Provider>
    </div>
  );
}
