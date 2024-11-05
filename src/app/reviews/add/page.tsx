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

const trustedBySchema = z.object({
  reviewerName: z.string().min(1, { message: "Reviewer is required" }),
  review: z.string().min(1, { message: "Review is required" }),
  image: z.any(),
});

type TrustedByForm = z.infer<typeof trustedBySchema>;

const Page = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TrustedByForm>({
    resolver: zodResolver(trustedBySchema),
  });

  const [file,setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const onSubmit = async (data: TrustedByForm) => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
      formData.append('file', file);
      formData.append('review', data.review);
      formData.append('reviewerName', data.reviewerName);

    try {
      setLoading(true);

      const response = await axios.post("/api/review", formData);

      if (response.status === 200) {
        console.log(response.data);
        toast.success("Review added successfully!");
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
      const response = await axios.get("/api/review");
      // console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await toast.promise(axios.delete(`/api/review/${id}`), {
        pending: 'Reveiw is deleting...',
        success: 'Review Deleted 👌',
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
      <Breadcrumb pageName="Reviews" />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Reviewer Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Reveiwer Name"
                    id="reviewerName"
                    {...register("reviewerName")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.reviewerName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.reviewerName.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Review <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    placeholder="Enter Review"
                    id="review"
                    {...register("review")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.review && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.review.message}
                    </p>
                  )}
                </div>

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
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div
                    className="cursor-pointer text-xl font-extrabold text-red-500 shrink-0"
                    onClick={() => {
                      handleDelete(review.id);
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
                      <span className="font-semibold">Reviwer Name: </span>
                      {review.reviewerName}
                    </span>
                    <span>
                      <span className="font-semibold">Review: </span>
                      {review.review}
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center justify-end overflow-hidden w-[90px] h-[80px] shrink-0">
                  <Image
                    className="object-cover w-full"
                    fill
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${review.image}`}
                    alt={`review ${index}`}
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
