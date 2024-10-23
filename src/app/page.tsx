"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/hero/add");
  }, [router]);

  return (
    <>
      <DefaultLayout>
        <p>Welcome To ASB Dashboard</p>
        {/* <ECommerce /> */}
      </DefaultLayout>
    </>
  );
}
