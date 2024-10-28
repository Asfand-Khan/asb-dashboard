export const dynamic = "force-dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  let data: any = null;
  let isLoading = false;
  const fetchData = async () => {
    try {
      isLoading = true;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/request-quote/${params.id}`,
      );
      console.log(response.data);
      data = response.data;
    } catch (error) {
      console.log(error);
    }finally{
      isLoading = false
    }
  };
  await fetchData();

  if(isLoading) return <Loader />

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detail Request Quote" goBack />
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Name :{" "}
              </div>
              <div>{data.name}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Email :{" "}
              </div>
              <div>{data.email}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Phone Number :{" "}
              </div>
              <div>{data.phone}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Job Title :{" "}
              </div>
              <div>{data.jobTitle}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Project Type :{" "}
              </div>
              <div>{data.projectType}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Services :{" "}
              </div>
              <div>{data.services}</div>
            </div>
            <div className="flex w-full flex-col items-start justify-start gap-7 md:flex-row md:items-start">
              <div className="w-[300px] text-lg font-medium text-black">
                Comments :{" "}
              </div>
              <div className="md:w-[600px]">
                {data.comments ? (
                  <span>{data.comments}</span>
                ) : (
                  <span className="text-red-500"> --- </span>
                )}
              </div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                File :{" "}
              </div>
              <div>
                {data.file ? (
                  <a
                    target="_blank"
                    className="cursor-pointer rounded-sm bg-secondary px-2 py-2 text-white"
                    href={`/api/request-quote/download?file=${data.file}&filename=${encodeURIComponent("RequestQuote.pdf")}`}
                    download="RequestQuote.pdf"
                  >
                    Download File
                  </a>
                ) : (
                  <span className="text-red-500">No File</span>
                )}
              </div>
            </div>
          </div>
        </div>
    </DefaultLayout>
  );
};

export default Page;
