"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

type ContentData = {
  id: string;
  bodyText: string;
};

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import ButtonLoader from "@/components/common/screenLoader";
import { toast } from "react-toastify";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const Page = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.length == 0 || value == "<p><br></p>") {
      toast.error("Please enter the our process content");
      return;
    }

    const formData = new FormData();
    formData.append("content", value);

    try {
      setLoading(true);

      const response = await axios.post("/api/service-page/our-process", formData);

      if (response.status === 200) {
        toast.success("Our process content added successfully");
        setValue("");
      }else{
        toast.error("Something went wrong");
        console.log(response)
      }

    } catch (error) {
      toast.error("Something went wrong");
      console.log(error)
    }finally{
      setLoading(false)
    }
  };

  const fetchContent = async () => {
    try {
      const response = await axios.get("/api/service-page/our-process");
      setContent(response.data);  // Setting the content state with the response data
      console.log("Fetched data: ", response.data);  // Check in console if data is being fetched
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching content: ", error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Our Process"/>
      <form onSubmit={handleSubmit}>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Our Process Content <span className="text-meta-1">*</span>
            </label>

            <ReactQuill theme="snow" value={value} onChange={setValue} />
          </div>
          <button
            disabled={loading}
            type="submit"
            className=" mt-5 flex w-full items-center justify-center gap-2 rounded bg-secondary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-secondary/50"
          >
            {loading && <ButtonLoader className="h-5 w-5 border-2" />}
            Add / Update
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
              <span className="font-medium">Content: </span>
              { content && <div className="content-html" dangerouslySetInnerHTML={{ __html: content.bodyText }} />}
            </div>
          </div>
      </form>
    </DefaultLayout>
  );
};

export default Page;
