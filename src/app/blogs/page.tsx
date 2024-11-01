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
      <Breadcrumb pageName="News Articles" />

      <div className="overflow-y-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="">
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
                  fontSize: "12px",
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
                  maxWidth: "1000px"
                }
              }
            }}
            columns={[
              {
                cell: (row: Blog) => (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Image
                        src={`/images/icon/trash.svg`}
                        alt="delete"
                        width={100}
                        height={100}
                      />
                    </span>
                    <Link
                      className="cursor-pointer"
                      href={`/blogs/${row.slug}`}
                    >
                      <Image
                        src={`/images/icon/edit.svg`}
                        alt="delete"
                        width={100}
                        height={100}
                      />
                    </Link>
                    <a
                      target="_blank"
                      href={`https://aussie-steel-beams.vercel.app/news_article/${row.slug}`}
                      className="cursor-pointer"
                    >
                      <Image
                        src={`/images/icon/eye.svg`}
                        alt="delete"
                        width={100}
                        height={100}
                      />
                    </a>
                  </span>
                ),
                center: true,
                width: "100px",
              },
              {
                name: "Image",
                cell: (row: Blog) => (
                  <span className="bg-[#f7f7f7] p-2 m-1 rounded-sm">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_ACCESS_URL}/${row.image}`}
                      alt="image"
                      width={100}
                      height={100}
                      className="rounded-sm"
                    />
                  </span>
                ),
                sortable: true,
                center: true,
                width: "80px",
              },
              {
                name: "Title",
                selector: (row: Blog) => row.title.slice(0, 100).concat("..."),
                sortable: true,
                center: true,
              },
              {
                name: "Short Description",
                selector: (row: Blog) => row.shortDesc.slice(0, 100),
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
      </div>
    </DefaultLayout>
  );
};

export default FormLayout;
