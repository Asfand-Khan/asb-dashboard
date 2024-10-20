"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import ButtonLoader from "@/components/common/screenLoader";
import { toast } from "react-toastify";

const Page = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(value.length == 0 || value == "<p><br></p>") {
      toast.error("Please enter the content");
      return;
    }

    console.log(value);
  };

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Service Content <span className="text-meta-1">*</span>
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
      </form>
    </DefaultLayout>
  );
};

export default Page;
