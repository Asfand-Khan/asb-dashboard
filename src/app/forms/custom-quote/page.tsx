"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

type CustomQuote = {
  id: string;
  jobTitle: string;
  primaryContactName: string;
  phoneNumber: string;
  email: string;
  comments: string | null;
  file: string | null;
};


const FormLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/custom");
      setData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Custom Quote" />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <DataTable
          data={data}
          progressPending={loading}
          pagination
          selectableRows
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
              name: "Job Title",
              selector: (row: CustomQuote) => row.jobTitle,
              sortable: true,
              center: true,
            },
            {
              name: "Primary Contact Name",
              selector: (row: CustomQuote) => row.primaryContactName,
              sortable: true,
              center: true,
            },
            {
              name: "Email",
              selector: (row: CustomQuote) => row.email,
              sortable: true,
              center: true,
            },
            {
              name: "Phone Number",
              selector: (row: CustomQuote) => row.phoneNumber,
              sortable: true,
              center: true,
            },
            {
              name: "Comments",
              selector: (row: CustomQuote) => row.comments ?? "---",
              sortable: true,
              center: true,
            },
            {
              name: "File",
              cell: (row: CustomQuote) => (
                <span>
                  {row.file ? (
                    <a
                      className="rounded-sm bg-secondary px-2 py-2 text-white cursor-pointer"
                      href={`${process.env.NEXT_PUBLIC_CLOUDINARY_PDF_ASSETS_ACCESS_URL}/${row.file}`}
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

export default FormLayout;
