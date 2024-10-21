"use client";

import ButtonLoader from "@/components/common/screenLoader";
import axios from "axios";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { z } from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInForm = z.infer<typeof signInSchema>;

const Page = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState<SignInForm>({
    email: "",
    password: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedData = signInSchema.safeParse(signInData);
    if (!parsedData.success) {
      const fieldErrors = parsedData.error.flatten().fieldErrors;
      console.log(fieldErrors);
      toast.error("Email and Password are required!");
      return;
    }

    const formData = new FormData();
    formData.append("email", parsedData.data.email);
    formData.append("password", parsedData.data.password);

    try {
      setLoading(true);
      const response = await axios.post("/api/sign-in", formData);
      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(cookies);
  }, []);
  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <div className="w-2/6 rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <Image
              width={80}
              height={80}
              src="/images/logo/logo.png"
              alt="logo"
            />
            <div className="flex flex-col items-center justify-center text-3xl font-medium tracking-wide">
              Sign In
              <div className="mt-2 text-sm">
                Sign in to your ASB dashboard account
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex w-full flex-col items-center justify-center gap-3">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                />
              </div>
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Password <span className="text-meta-1">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded bg-secondary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-secondary/50"
              >
                {loading && <ButtonLoader className="h-5 w-5 border-2" />}
                Add / Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
