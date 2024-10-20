'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonLoader from "@/components/common/screenLoader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  bodyText: z.string().min(1, { message: "Body text is required" }),
});

const Page = () => {
  
  const [bodyText, setBodyText] = useState('');
  const [showBodyText, setShowBodyText] = useState('');

  const [errors, setErrors] = useState({ bodyText: ""});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = formSchema.safeParse({bodyText});

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        bodyText: fieldErrors.bodyText?.[0] || "",
      });
    } else {
      setErrors({ bodyText: "" });

      try {
        setLoading(true);
        const response = await axios.post("/api/our-mission", { bodyText });
        console.log(response);

        if (response.status === 200) {
          setBodyText('');
          fetchData();
          toast.success("Hero created successfully");
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchData = async() => {
    try {
      const response = await axios.get("/api/our-mission");

      const data = response.data;
      if (response.status === 200) {
        setShowBodyText(data.bodyText);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Our Mission" />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Enter Body Text <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter Body Text"
                    value={bodyText}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setBodyText(e.target.value)}
                  />
                  {errors.bodyText && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bodyText}
                    </p>
                  )}
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

          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
              <span className="font-medium">Body Text: </span>
              <span>{showBodyText}</span>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
