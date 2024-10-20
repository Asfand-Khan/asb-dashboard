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

const servicesSchema = z.object({
  headingText: z.string().min(1, { message: "Heading Text is required" }),
  bodyText: z.string().min(1, { message: "Body Text is required" }),
  image: z.any(),
});

type ServicesForm = z.infer<typeof servicesSchema>;

const Page = () => {
  const [services, setServices] = useState<any[]>([]);
  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServicesForm>({
    resolver: zodResolver(servicesSchema),
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const onSubmit = async (data: ServicesForm) => {
    if (!imageBase64) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...data,
        image: imageBase64 ?? null,
      };

      const response = await axios.post("/api/services", dataToSend);

      if (response.status === 200) {
        console.log(response.data);
        toast.success("Services added successfully!");
        fetchData();
        reset();
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
      const response = await axios.get("/api/services");
      // console.log(response.data);
      setServices(response.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await toast.promise(axios.delete(`/api/services/${id}`), {
        pending: 'Service is deleting...',
        success: 'Service Deleted 👌',
        error: 'Oops!! Something went wrong 🤯'
      });
      if (response.status === 200) {
        fetchData();
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
      <Breadcrumb pageName="Services" />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Heading Text <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter heading text"
                    id="headingText"
                    {...register("headingText")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.headingText && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.headingText.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Body Text <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    placeholder="Enter Review"
                    id="bodyText"
                    {...register("bodyText")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.bodyText && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bodyText.message}
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
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div
                    className="cursor-pointer text-xl font-extrabold text-red-500"
                    onClick={() => {
                      handleDelete(service.id);
                    }}
                  >
                    x
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>
                      <span className="font-semibold">Heading Text: </span>
                      {service.headingText}
                    </span>
                    <span>
                      <span className="font-semibold">Body Text: </span>
                      {service.text}
                    </span>
                  </div>
                </div>
                <div className="flex w-4/12 items-center justify-end overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={`/uploads/services/${service.image}`}
                    alt={`service ${index}`}
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
