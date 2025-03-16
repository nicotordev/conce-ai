"use client";
import { TanstackUseQueryProviderProps } from "@/types/providers";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function TanstackUseQueryProvider({
  children,
}: TanstackUseQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
