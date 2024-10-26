"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import Image from "next/image";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

const FormLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/blogs");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await toast.promise(axios.delete(`/api/blogs/${id}`), {
        pending: "Deleting Blog",
        success: "Blog deleted successfully",
        error: "Something went wrong",
      });

      if (response.status === 200) {
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
      <Breadcrumb pageName="All Blogs" />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <DataTable
          data={data}
          progressPending={loading}
          paginationServer
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
              cell: (row: Blog) => (
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
              cell: (row: Blog) => (
                <a target="_blank" href={`#`} className="cursor-pointer">
                  <Image
                    src={`/images/icon/eye.svg`}
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </a>
              ),
              center: true,
              width: "50px",
            },
            {
              cell: (row: Blog) => (
                <Link
                  className="cursor-pointer"
                  href={`/blogs/${row.slug}`}
                >
                  <Image
                    src={`/images/icon/edit.svg`}
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </Link>
              ),
              center: true,
              width: "50px",
            },
            {
              name: "Image",
              cell: (row: Blog) => 
              <span className="bg-[#f7f7f7]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${row.image}`}
                  alt="image"
                  width={100}
                  height={100}
                />
              </span>,
              sortable: true,
              center: true,
              width: "100px",
            },
            {
              name: "Title",
              selector: (row: Blog) => row.title,
              sortable: true,
              center: true,
            },
            {
              name: "Short Description",
              selector: (row: Blog) => row.shortDesc,
              sortable: true,
              center: true,
            },
            {
              name: "Long Description",
              selector: (row: Blog) => row.longDesc,
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
