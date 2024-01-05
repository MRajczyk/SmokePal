import Provider from "../context/client-provider";
import Image from "next/image";
import CoverPhoto from "@/public/assets/bgAuth.jpg";
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
            <div className="relative w-full flex flex-row justify-center bg-black">
              <Image
                src={CoverPhoto}
                alt="Picture of smoked meat"
                objectFit="cover"
                fill
                className="absolute opacity-60"
              />
              <div className="flex w-full h-full flex-col z-[1] text-center items-center justify-start overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </Provider>
      </QueryClientProviderWrapper>
    </main>
  );
}
