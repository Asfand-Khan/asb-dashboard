"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonLoader from "@/components/common/screenLoader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Image from "next/image";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Page = () => {
  const editor = useRef(null);
  const [value, setValue] = useState("");
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // const handleFileChange = (e: any) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setImageBase64(reader.result);
  //   };
  // };

  const [file1, setFile1] = useState<File | null>(null);
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile1(selectedFile);
  };

  const [file2, setFile2] = useState<File | null>(null);
  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile2(selectedFile);
  };

  const [file3, setFile3] = useState<File | null>(null);
  const handleFileChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile3(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.length == 0 || value == "<p><br></p>") {
      toast.error("Please enter the case study content");
      return;
    }

    if (!file1) {
      toast.error("Images 1 is required.");
      return;
    }

    const formData = new FormData();
    formData.append("content", value);
    formData.append("file1", file1);
    if (file2) formData.append("file2", file2);
    if (file3) formData.append("file3", file3);

    try {
      setLoading(true);
      const response = await axios.post("/api/case-study", formData);

      if (response.status === 200) {
        toast.success("Case study added successfully!");
        fetchData();
        setValue("");
        setFile1(null);
        setFile2(null);
        setFile3(null);
      } else {
        toast.error("Something went wrong");
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await toast.promise(axios.delete(`/api/case-study/${id}`), {
        pending: "Deleting Case Study",
        success: "Case Study deleted successfully",
        error: "Something went wrong",
      })
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

  const handleQuillChange = (value: string) => {
    setValue(value);
  };

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
                    Case Study Editor <span className="text-meta-1">*</span>
                  </label>
                  <JoditEditor
                    value={value}
                    onChange={handleQuillChange}
                    ref={editor}
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image 1 <span className="text-meta-1"></span>
                  </label>
                  <input
                    type="file"
                    placeholder="Choose image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange1}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-secondary file:hover:bg-opacity-10 focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-secondary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image 2 <span className="text-meta-1"></span>
                  </label>
                  <input
                    type="file"
                    placeholder="Choose image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange2}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-secondary file:hover:bg-opacity-10 focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-secondary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image 3 <span className="text-meta-1"></span>
                  </label>
                  <input
                    type="file"
                    placeholder="Choose image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange3}
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
              <div
                key={caseStudy.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div
                    className="cursor-pointer text-xl font-extrabold text-red-500"
                    onClick={() => {
                      handleDelete(caseStudy.id);
                    }}
                  >
                    <Image
                      width={20}
                      height={20}
                      alt="trash"
                      src={"/images/icon/trash.svg"}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>
                      <span className="font-semibold">Content: </span>
                      {caseStudy.content && (
                        <div
                          className="content-html"
                          dangerouslySetInnerHTML={{
                            __html: caseStudy.content,
                          }}
                        />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex w-4/12 items-center justify-end overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${caseStudy.images[0]}`}
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
