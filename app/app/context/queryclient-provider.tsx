"use client";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
