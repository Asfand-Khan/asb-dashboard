export const dynamic = "force-dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import React, { Suspense } from "react";

const page = async ({ params }: { params: { id: string } }) => {
  let data: any = null;
  let isLoading = false;
  const fetchData = async () => {
    try {
      isLoading = true;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/custom/${params.id}`,
      );
      console.log(response.data);
      data = response.data;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading = false;
    }
  };

  await fetchData();

  if (isLoading) return <Loader />;

  return (
    <DefaultLayout>
      <Suspense fallback={<Loader />}>
        <Breadcrumb pageName="Detail Request Quote" goBack />
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Primary Contact Name :{" "}
              </div>
              <div>{data.primaryContactName}</div>
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
              <div>{data.phoneNumber}</div>
            </div>
            <div className="flex w-full items-center justify-start gap-7">
              <div className="w-[300px] text-lg font-medium text-black">
                Job Title :{" "}
              </div>
              <div>{data.jobTitle}</div>
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
                    href={`/api/custom/download?file=${data.file}&filename=${encodeURIComponent("CustomQuote.pdf")}`}
                    download="CustomQuote.pdf"
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
      </Suspense>
    </DefaultLayout>
  );
};

export default page;
