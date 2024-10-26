'use client';

import Image from "next/image";
import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  goBack?: boolean;
}
const Breadcrumb = ({ pageName,goBack }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-secondary dark:text-white flex items-center justify-start gap-4">
        <span>
          {goBack && (
            <>
              <button onClick={() => window.history.back()} className="mt-1 transition-all hover:bg-slate-200 p-3 rounded-full">
                <Image
                  src={"/images/icon/arrow-left.svg"}
                  alt="arrow-left"
                  width={25}
                  height={25}
                />
              </button>
            </>
          )}
        </span>
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2 text-secondary">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
