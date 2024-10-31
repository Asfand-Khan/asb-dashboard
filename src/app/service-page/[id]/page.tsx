// "use client";

// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import ButtonLoader from "@/components/common/screenLoader";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useState, useEffect } from "react";
// import { z } from "zod";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import Loader from "@/components/common/Loader";
// import { useParams } from "next/navigation";

// const makeSlug = (word: string) => {
//   return word
//     .toLowerCase()
//     .replace(/ /g, "-")
//     .replace(/[^\w-]+/g, "");
// };

// const blogSchema = z.object({
//   title: z.string().min(1, { message: "Title is required" }),
//   shortDesc: z
//     .string()
//     .min(1, { message: "Short Description is required" })
//     .max(100, {
//       message: "Short Description should be less than 100 characters",
//     }),
//   longDesc: z.string().min(1, { message: "Long Description is required" }),
//   image: z.any(),
// });

// type BlogForm = z.infer<typeof blogSchema>;

// const Page = () => {
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const { id } = useParams();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     getValues,
//     setValue,
//   } = useForm<BlogForm>({
//     resolver: zodResolver(blogSchema),
//   });

//   // const handleFileChange = (e: any) => {
//   //   const file = e.target.files[0];

//   //   const reader = new FileReader();
//   //   reader.readAsDataURL(file);
//   //   reader.onloadend = () => {
//   //     setImageBase64(reader.result);
//   //   };
//   // };

//   const [file, setFile] = useState<File | null>(null);
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//   };

//   const onSubmit = async (data: BlogForm) => {
//     console.log(data);
//     console.log(file);

//     if (!file) {
//       toast.error("Please upload an image");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", data.title);
//     formData.append("longDesc", data.longDesc);
//     formData.append("shortDesc", data.shortDesc);
//     formData.append("slug", makeSlug(data.title));

//     try {
//       setLoading(true);
//       const response = await axios.post("/api/blogs", formData);

//       if (response.status === 200) {
//         toast.success("Blog added successfully!");
//         reset();
//       } else {
//         toast.error("Something went wrong");
//         console.log(response.data);
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`/api/blogs/${id}`);
//       console.log(response.data);

//       if (response.status == 200) {
//         setValue("title", response.data.title);
//         setValue("shortDesc", response.data.shortDesc);
//         setValue("longDesc", response.data.longDesc);
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.log(error);
//     }
//   };

//   // const onSubmit = async (data: BlogForm) => {

//   //   if (!imageBase64) {
//   //     toast.error("Please upload an image");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const dataToSend = {
//   //       ...data,
//   //       image: imageBase64 ?? null,
//   //     };

//   //     const response = await axios.post("/api/case-study", dataToSend);

//   //     if (response.status === 200) {
//   //       console.log(response.data);
//   //       toast.success("Case study added successfully!");
//   //       fetchData();
//   //       reset();
//   //     } else {
//   //       toast.error("Something went wrong!");
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //     toast.error("Something went wrong!");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleQuillChange = (value: string) => {
//     setValue("longDesc", value);
//   };

//   useEffect(() => {
//     // setPageLoading(false);
//     fetchData();
//   }, []);

//   //   if(pageLoading) return <Loader/>;

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Edit Blog" />
//       <div className="">
//         <div className="flex flex-col gap-9">
//           <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="p-6.5">
//                 <div className="mb-4.5">
//                   <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                     Title <span className="text-meta-1">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter Title"
//                     id="title"
//                     {...register("title")}
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
//                   />
//                   {errors.title && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.title.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                     Short Description <span className="text-meta-1">*</span>
//                   </label>
//                   <textarea
//                     maxLength={100}
//                     placeholder="Enter Short Description"
//                     id="shortDesc"
//                     {...register("shortDesc")}
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
//                   />
//                   {errors.shortDesc && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.shortDesc.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                     Long Description <span className="text-meta-1">*</span>
//                   </label>
//                   <ReactQuill
//                     theme="snow"
//                     value={getValues("longDesc") || ""}
//                     onChange={handleQuillChange}
//                   />
//                   {errors.longDesc && (
//                     <p className="mt-1 text-sm text-red-500">
//                       Long Description is required
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                     Image <span className="text-meta-1"></span>
//                   </label>
//                   <input
//                     type="file"
//                     placeholder="Choose image"
//                     id="image"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-secondary file:hover:bg-opacity-10 focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-secondary"
//                   />
//                 </div>

//                 <button
//                   disabled={loading}
//                   type="submit"
//                   className="flex w-full items-center justify-center gap-2 rounded bg-secondary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-secondary/50"
//                 >
//                   {loading && <ButtonLoader className="h-5 w-5 border-2" />}
//                   Add
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </DefaultLayout>
//   );
// };

// export default Page;

"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonLoader from "@/components/common/screenLoader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Loader from "@/components/common/Loader";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const makeSlug = (word: string) => {
  return word
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  shortDesc: z
    .string()
    .min(1, { message: "Short Description is required" })
    .max(100, {
      message: "Short Description should be less than 100 characters",
    }),
  longDesc: z.string().min(1, { message: "Long Description is required" }),
  image: z.any(),
});

type BlogForm = z.infer<typeof blogSchema>;

const Page = () => {
  const editor = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const [longDesc, setLongDesc] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const onSubmit = async (data: BlogForm) => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("update", "true");
    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("longDesc", longDesc); // use longDesc state here
    formData.append("shortDesc", data.shortDesc);
    formData.append("slug", makeSlug(data.title));

    try {
      setLoading(true);
      const response = await axios.post(`/api/service`, formData);

      if (response.status === 200) {
        toast.success("Service updated successfully!");
        reset();
        setLongDesc("");
        router.push("/service-page");
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

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`/api/blogs/${id}`);
  //     console.log(response.data);

  //     if (response.status == 200) {
  //       setValue("title", response.data.title);
  //       setValue("shortDesc", response.data.shortDesc);
  //       setValue("longDesc", response.data.longDesc);
  //       setLongDesc(response.data.longDesc); // Update longDesc state
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //     console.log(error);
  //   } finally {
  //     setPageLoading(false);
  //   }
  // };

  const handleQuillChange = (value: string) => {
    setLongDesc(value); // Update longDesc state on Quill change
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/service/${id}`);
      console.log(response.data);

      if (response.status === 200) {
        setValue("title", response.data.title);
        setValue("shortDesc", response.data.shortDesc);
        setValue("longDesc", response.data.longDesc);
        setValue("image", response.data.image);
        setLongDesc(response.data.longDesc); // Update longDesc state
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setPageLoading(false);
    }, 3000);
  }, [fetchData]);

  if (pageLoading) return <Loader />;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Service" goBack />
      <div className="">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    id="title"
                    {...register("title")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Short Description <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    maxLength={100}
                    placeholder="Enter Short Description"
                    id="shortDesc"
                    {...register("shortDesc")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-secondary active:border-secondary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-secondary"
                  />
                  {errors.shortDesc && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.shortDesc.message}
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Long Description <span className="text-meta-1">*</span>
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={longDesc} // use longDesc state
                    onChange={handleQuillChange}
                  />
                  {errors.longDesc && (
                    <p className="mt-1 text-sm text-red-500">
                      Long Description is required
                    </p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image{" "}
                    <span className="text-meta-1">
                      (Image will be updated as soon as you press update)
                    </span>
                  </label>
                  <div className="m-1 w-fit rounded-sm bg-[#f7f7f7] p-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${getValues("image")}`}
                      alt="blog image"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image <span className="text-meta-1">(1024px x 1024px)</span>
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
                  Update
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
