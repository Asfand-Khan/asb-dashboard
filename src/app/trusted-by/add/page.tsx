"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonLoader from "@/components/common/screenLoader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import Image from "next/image";

const caseStudySchema = z.object({
  image: z.any(),
});

type CaseStudyForm = z.infer<typeof caseStudySchema>;

const Page = () => {
  const [trustedBy, setTrustedBy] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post("/api/trusted-by", formData);

      if (response.status === 200) {
        console.log(response.data);
        toast.success("Trusted By added successfully!");
        fetchData();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/trusted-by");
      // console.log(response.data);
      setTrustedBy(response.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await toast.promise(axios.delete(`/api/trusted-by/${id}`),{
        error: 'Oops! Something went wrong',
        pending: 'Trusted By is deleting...',
        success: 'Trusted By Deleted',
      })
      if (response.status === 200) {
        fetchData();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Case Study" />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image <span className="text-meta-1">(1024x1024)</span>
                  </label>
                  <input
                    type="file"
                    placeholder="Choose image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-secondary file:hover:bg-opacity-10 focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-secondary"
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

          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            {trustedBy.map((eachTrustedBy, index) => (
              <div
                key={eachTrustedBy.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div
                    className="cursor-pointer text-xl font-extrabold text-red-500"
                    onClick={() => {
                      handleDelete(eachTrustedBy.id);
                    }}
                  >
                    <Image
                      width={20}
                      height={20}
                      alt="trash"
                      src={"/images/icon/trash.svg"}
                    />
                  </div>
                </div>
                <div className="flex w-4/12 items-center justify-end overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${eachTrustedBy.image}`}
                    alt={`case study ${index}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
