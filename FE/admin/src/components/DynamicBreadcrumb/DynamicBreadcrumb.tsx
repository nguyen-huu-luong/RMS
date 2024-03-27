"use client";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DynamicBreadcrumb() {
  const router = useRouter();
  const pathname = usePathname();

  const items = pathname.split("/").map((cur, index, array) => ({
    title: cur ? (index < array.length - 1?
      <Link className="first-letter:uppercase" href={`/${array.slice(1, index + 1).join("/")}`}>
        {cur}
      </Link> : cur[0].toLocaleUpperCase() + cur.slice(1,cur.length)
    ) : (
      <HomeOutlined />
    ),
  }));

  return (
      <Breadcrumb items={items} />
    // <div className="w-full flex items-center bg-white py-2 space-x-2 px-10 mx-2 my-2 rounded border">
    // </div>
  );
}
