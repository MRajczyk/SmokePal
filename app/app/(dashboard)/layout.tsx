import Provider from "../context/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import QueryClientProviderWrapper from "../context/queryclient-provider";
import smokepalLogo from "@/public/assets/logo.svg";
import Image from "next/image";

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
    <main className="w-full h-full">
      <QueryClientProviderWrapper>
        <Provider session={session}>
          <div className="w-full h-full flex flex-row">
            <div className="bg-orange-600 w-[100px] flex flex-col">
              <Image
                src={smokepalLogo}
                alt="SmokePal Logo"
                className="cursor-pointer"
              ></Image>
            </div>
            <div className="bg-white w-full">{children}</div>
          </div>
        </Provider>
      </QueryClientProviderWrapper>
    </main>
  );
}
