import Image from "next/image";
import CoverPhoto from "@/public/assets/bgAuth.jpg";
import { Poppins } from "next/font/google";
// @ts-expect-error this library doesnt support typescript at all.............
import Logo from "@/public/assets/logoNoLogotype.svg?url";
// @ts-expect-error this library doesnt support typescript at all.............
import Logotype from "@/public/assets/logotype.svg?url";
// @ts-expect-error this library doesnt support typescript at all.............
import LogotypeText from "@/public/assets/logotypeText.svg?url";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`${poppins.className} w-full h-full`}>
      <div className="grid grid-cols-2 w-full h-full">
        <div className="relative flex col-span-1 w-full overflow-hidden items-center justify-center">
          <Image
            src={CoverPhoto}
            alt="Picture of smoked meat"
            objectFit="cover"
            fill
            className="absolute"
          />
          <div className="flex flex-col z-[1] text-center items-center justify-center gap-9">
            <h3 className="text-2xl text-[#F4EDE5] font-bold w-[500px]">
              Master the art of smoking with SmokePal,
              <br />
              Your ultimate companion!
            </h3>
            <p className="w-[500px] text-base text-[#F4EDE5]">
              Say goodbye to guesswork and hello to perfection with SmokePal -
              the ultimate app designed for enthusiasts! This app is your go-to
              partner for mastering the art of smoking. Effortlessly control
              your smoker's temperature, receive instant alerts, and access a
              treasure trove of recipes tailored for unforgettable taste.
              <br />
              <br />
              Elevate your smoke game with SmokePal!
            </p>
            <Image src={Logo} alt="Picture of smoked meat" width={201} />
            <Image src={Logotype} alt="Picture of smoked meat" />
            <Image src={LogotypeText} alt="Picture of smoked meat" />
          </div>
        </div>
        <div className="flex bg-[#15191C] col-span-1 justify-center items-center">
          {children}
        </div>
      </div>
    </main>
  );
}
