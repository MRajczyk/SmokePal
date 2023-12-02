import Provider from "../context/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import QueryClientProviderWrapper from "../context/queryClient-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div>
      <QueryClientProviderWrapper>
        <Provider session={session}>{children}</Provider>
      </QueryClientProviderWrapper>
    </div>
  );
}
