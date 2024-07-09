import { useMemo } from "react";
import { useRouter } from "next/navigation";

export function useInternalRouter() {
  const router = useRouter();

  return useMemo(() => {
    return {
      push(path: RoutePath) {
        router.push(path);
      },
      replace(path: RoutePath) {
        router.replace(path);
      },
    };
  }, [router]);
}

type RoutePath = `/${string}`;
