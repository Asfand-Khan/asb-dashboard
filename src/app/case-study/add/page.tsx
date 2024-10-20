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
  location: z.string().min(1, { message: "Location is required" }),
  problem: z.string().min(1, { message: "Problem is required" }),
  solution: z.string().min(1, { message: "Solution is required" }),
  image: z.any(),
});

type CaseStudyForm = z.infer<typeof caseStudySchema>;

const Page = () => {
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseStudyForm>({
    resolver: zodResolver(caseStudySchema),
  });

  // const handleFileChange = (e: any) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setImageBase64(reader.result);
  //   };
  // };

  const [file,setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const onSubmit = async (data:CaseStudyForm) => {
    console.log(data);
    console.log(file);

    if(!file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
      formData.append('file', file);
      formData.append('location', data.location);
      formData.append('problem', data.problem);
      formData.append('solution', data.solution);

    try {
      setLoading(true);
      const response = await axios.post('/api/case-study',formData);

      if (response.status === 200) {
        toast.success("Case study added successfully!");
        fetchData();
        reset();
      }else{
        toast.error("Something went wrong");
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // const onSubmit = async (data: CaseStudyForm) => {
    
  //   if (!imageBase64) {
  //     toast.error("Please upload an image");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const dataToSend = {
  //       ...data,
  //       image: imageBase64 ?? null,
  //     };

  //     const response = await axios.post("/api/case-study", dataToSend);

  //     if (response.status === 200) {
  //       console.log(response.data);
  //       toast.success("Case study added successfully!");
  //       fetchData();
  //       reset();
  //     } else {
  //       toast.error("Something went wrong!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/case-study");
      // console.log(response.data);
      setCaseStudies(response.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      // console.log(caseStudy)
      const response = await axios.delete(`/api/case-study/${id}`);
      if (response.status === 200) {
        toast.success("Case study deleted successfully!");
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Location <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    id="location"
                    {...register("location")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Problem <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Problem"
                    id="problem"
                    {...register("problem")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.problem && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.problem.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Solution <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Solution"
                    id="solution"
                    {...register("solution")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.solution && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.solution.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image <span className="text-meta-1"></span>
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
            {caseStudies.map((caseStudy, index) => (
              <div key={caseStudy.id} className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="text-red-500 font-extrabold text-xl cursor-pointer" onClick={()=>{ handleDelete(caseStudy.id)}}>x</div>
                  <div className="flex flex-col gap-1">
                    <span>
                      <span className="font-semibold">Location: </span>
                      {caseStudy.location}
                      </span>
                    <span>
                    <span className="font-semibold">Problem: </span>
                      {caseStudy.problem}
                      </span>
                    <span>
                    <span className="font-semibold">Solution: </span>
                      {caseStudy.solution}
                      </span>
                  </div>
                </div>
                <div className="w-4/12 flex justify-end items-center overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={`${process.env.CLOUDINARY_ASSETS_ACCESS_URL}/${caseStudy.image}`}
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
