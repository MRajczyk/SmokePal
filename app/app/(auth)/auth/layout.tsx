export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex bg-white w-[50%] h-[50%] justify-center items-center bg-opacity-60 rounded-3xl">
        {children}
      </div>
    </div>
  );
}
