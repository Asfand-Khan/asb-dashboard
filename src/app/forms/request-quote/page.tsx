"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

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
      const response = await toast.promise(axios.delete(`/api/request-quote/${id}`), {
        pending: "Deleting Request Quote",
        success: "Request Quote deleted successfully",
        error: "Something went wrong",
      });

      if(response.status === 200){
        fetchData();
      }
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

      <div className="overflow-x-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
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
                textAlign: "center",
              },
            },
            pagination: {
              style: {
                backgroundColor: "#f7f7f7",
                color: "black",
                fontSize: "14px",
              },
            },
            rows:{
              style:{
                maxWidth: "1080px",
                textAlign: "center",
              }
            }
          }}
          columns={[
            {
              cell: (row: RequestQuote) => (
                <span className="flex gap-2 items-center justify-center">
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
                <Link href={`/forms/request-quote/${row.id}`}>
                <Image
                    src={`/images/icon/eye.svg`}
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </Link>
                </span>
              ),
              center: true,
              width: "100px",
            },
            {
              name: "Name",
              selector: (row: RequestQuote) => row.name,
              sortable: true,
              center: true
            },
            {
              name: "Email",
              selector: (row: RequestQuote) => row.email,
              sortable: true,
              center: true,
              width: "200px",
            },
            {
              name: "Phone",
              selector: (row: RequestQuote) => row.phone,
              sortable: true,
              center: true,
              width: "200px",
            },
            {
              name: "Job Title",
              selector: (row: RequestQuote) => row.jobTitle,
              sortable: true,
              center: true,
              width: "200px",
            },
            {
              name: "Project Type",
              selector: (row: RequestQuote) => row.projectType,
              sortable: true,
              center: true,
              width: "200px"
            },
            {
              name: "Services",
              selector: (row: RequestQuote) => row.services,
              sortable: true,
              center: true,
              width: "150px"
            },
            {
              name: "Comments",
              selector: (row: RequestQuote) => row.comments.length > 0 ? row.comments : "No Comments",
              sortable: true,
              center: true,
              width: "200px"
            },
            {
              name: "File",
              cell: (row: RequestQuote) => (
                <span>
                  {row.file ? (
                    <a
                      target="_blank"
                      className="cursor-pointer rounded-sm bg-secondary px-2 py-2 text-white"
                      href={`/api/custom/download?file=${row.file}&filename=${encodeURIComponent('RequestQuote.pdf')}`}
                      download="CustomQuote.pdf"
                    >
                      Download File
                    </a>
                  ) : (
                    <span className="text-red-500 text-center">No File!</span>
                  )}
                </span>
              ),
              sortable: true,
              center: true,
              width: "150px"
            },
          ]}
        />
      </div>
    </DefaultLayout>
  );
};

export default FormElementsPage;
