import { useRouter } from "next/router";
import { useEffect } from "react";

// Temporary. Move to app/ directory when it's supported

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  return null;
}
