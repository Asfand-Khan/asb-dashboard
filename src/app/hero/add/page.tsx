"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonLoader from "@/components/common/screenLoader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  primaryText: z.string().min(1, { message: "Primary text is required" }),
  secondaryText: z.string().min(1, { message: "Secondary text is required" }),
});

const Page = () => {
  const [formData, setFormData] = useState({
    primaryText: "",
    secondaryText: "",
  });
  const [errors, setErrors] = useState({ primaryText: "", secondaryText: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form data using Zod schema
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      // Set error messages
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        primaryText: fieldErrors.primaryText?.[0] || "",
        secondaryText: fieldErrors.secondaryText?.[0] || "",
      });
    } else {
      setErrors({ primaryText: "", secondaryText: "" });

      try {
        setLoading(true);
        const response = await axios.post("/api/hero", formData);
        console.log(response);

        if (response.status === 200) {
          setFormData({ primaryText: "", secondaryText: "" });
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hero" />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Primary Text <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="primaryText"
                    value={formData.primaryText}
                    onChange={handleInputChange}
                    placeholder="Enter Primary Text"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.primaryText && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.primaryText}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Secondary Text <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="secondaryText"
                    value={formData.secondaryText}
                    onChange={handleInputChange}
                    placeholder="Enter Secondary Text"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.secondaryText && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.secondaryText}
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
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
