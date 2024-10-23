"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

type RequestQuote = {
  comments: string;
  email: string;
  file: string;
  id: string;
  jobTitle: string;
  name: string;
  phone: string;
  projectType: string;
  services: string;
};

const FormElementsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/request-quote");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await toast.promise(axios.delete(`/api/request-quote/${id}`), {
        pending: "Deleting Request Quote",
        success: "Request Quote deleted successfully",
        error: "Something went wrong",
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Request Quote" />

      <div className="overflow-x-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark lg:w-[920px]">
        <DataTable
          data={data}
          progressPending={loading}
          pagination
          responsive
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#f7f7f7",
                color: "black",
                fontSize: "14px",
              },
            },
            pagination: {
              style: {
                backgroundColor: "#f7f7f7",
                color: "black",
                fontSize: "14px",
              },
            },
          }}
          columns={[
            {
              cell: (row: RequestQuote) => (
                <span
                  className="cursor-pointer"
                  onClick={() => handleDelete(row.id)}
                >
                  <Image
                    src={`/images/icon/trash.svg`}
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </span>
              ),
              center: true,
              width: "50px",
            },
            {
              name: "Name",
              selector: (row: RequestQuote) => row.name,
              sortable: true,
              center: true,
            },
            {
              name: "Email",
              selector: (row: RequestQuote) => row.email,
              sortable: true,
              center: true,
            },
            {
              name: "Phone",
              selector: (row: RequestQuote) => row.phone,
              sortable: true,
              center: true,
            },
            {
              name: "Job Title",
              selector: (row: RequestQuote) => row.jobTitle,
              sortable: true,
              center: true,
            },
            {
              name: "Project Type",
              selector: (row: RequestQuote) => row.projectType,
              sortable: true,
              center: true,
            },
            {
              name: "Services",
              selector: (row: RequestQuote) => row.services,
              sortable: true,
              center: true,
            },
            {
              name: "Comments",
              selector: (row: RequestQuote) => row.comments,
              sortable: true,
              center: true,
            },
            {
              name: "File",
              cell: (row: RequestQuote) => (
                <span>
                  {row.file ? (
                    <a
                      target="_blank"
                      className="cursor-pointer rounded-sm bg-secondary px-2 py-2 text-white"
                      href={`${process.env.NEXT_PUBLIC_CLOUDINARY_PDF_ASSETS_ACCESS_URL}/${row.file}.pdf`}
                      download="CustomQuote.pdf"
                    >
                      Download File
                    </a>
                  ) : (
                    <span className="text-red-500">No File!</span>
                  )}
                </span>
              ),
              sortable: true,
              center: true,
            },
          ]}
        />
      </div>
    </DefaultLayout>
  );
};

export default FormElementsPage;
