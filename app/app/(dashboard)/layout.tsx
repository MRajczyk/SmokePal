import Provider from "../context/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import QueryClientProviderWrapper from "../context/queryclient-provider";
import Image from "next/image";
import { LogoutButton } from "@/components/ui/logoutButton";
import smokepalLogo from "@/public/assets/logo.svg";
import addIcon from "@/public/assets/add_placeholder.svg";
import historyIcon from "@/public/assets/history_placeholder.svg";
import logoutIcon from "@/public/assets/logout_placeholder.svg";
// import recipesIcon from "@/public/assets/recipes_placeholder.svg";
import smokerIcon from "@/public/assets/smoker_placeholder.svg";
import settingsIcon from "@/public/assets/settings_placeholder.svg";
import homeIcon from "@/public/assets/home_placeholder.svg";

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
            <div className="bg-orange-600 w-[100px] flex flex-col justify-between items-center">
              <Link href={{ pathname: "/" }}>
                <Image
                  src={smokepalLogo}
                  alt="SmokePal Logo"
                  className="cursor-pointer"
                ></Image>
              </Link>
              <div className="flex flex-col justify-center items-center gap-[10px]">
                <Link className="w-12 h-12" href={{ pathname: "/" }}>
                  <Image
                    src={homeIcon}
                    alt="Home icon"
                    className="cursor-pointer"
                  ></Image>
                </Link>
                <Link className="w-12 h-12" href={{ pathname: "/new-session" }}>
                  <Image
                    src={addIcon}
                    alt="Add icon"
                    className="cursor-pointer"
                  ></Image>
                </Link>
                <Link
                  className="w-12 h-12"
                  href={{ pathname: "/current-session" }}
                >
                  <Image
                    src={smokerIcon}
                    alt="Smoker icon"
                    className="cursor-pointer"
                  ></Image>
                </Link>
                <Link className="w-12 h-12" href={{ pathname: "/history" }}>
                  <Image
                    src={historyIcon}
                    alt="History icon"
                    className="cursor-pointer"
                  ></Image>
                </Link>
                {/*TODO: in the future <Link className="w-12 h-12" href={{ pathname: "/recipes" }}>
                  <Image
                    src={recipesIcon}
                    alt="Recipes icon"
                    className="cursor-pointer"
                  ></Image>
                </Link> */}
              </div>
              <div className="flex flex-col justify-center items-center gap-[10px] mb-10  ">
                <Link className="w-12 h-12" href={{ pathname: "/settings" }}>
                  <Image
                    src={settingsIcon}
                    alt="Settings icon"
                    className="cursor-pointer"
                  ></Image>
                </Link>
                <LogoutButton>
                  <Image
                    src={logoutIcon}
                    alt="Logout icon"
                    className="cursor-pointer w-12 h-12"
                  ></Image>
                </LogoutButton>
              </div>
            </div>
            <div className="bg-white w-full">{children}</div>
          </div>
        </Provider>
      </QueryClientProviderWrapper>
    </main>
  );
}
