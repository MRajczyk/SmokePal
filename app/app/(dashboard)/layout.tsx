import Provider from "../context/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import QueryClientProviderWrapper from "../context/queryclient-provider";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <main className={`${poppins.className} w-full h-full`}>
      <QueryClientProviderWrapper>
        <Provider session={session}>
          <div className="w-full h-full flex flex-row">
            <Sidebar />
            <div className="w-full flex flex-row justify-center overflow-y-auto">
              {children}
            </div>
          </div>
        </Provider>
      </QueryClientProviderWrapper>
    </main>
  );
}
