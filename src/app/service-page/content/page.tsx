"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Page = () => {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    console.log(value);
  };

  return (
    <DefaultLayout>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <button onClick={handleSubmit}>Submit</button>
    </DefaultLayout>
  );
};

export default Page;
