"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SidebarSkeleton() {
  return (
    <div className="mx-5">
      <Skeleton width={100} height={10} />
      <Skeleton width={150} />
      <Skeleton width={200} />
      <Skeleton />
      <Skeleton width={100} />
      <div className="mt-5"></div>
      <Skeleton width={100} height={10} />
      <Skeleton height={69} />
      <Skeleton height={69} />
      <Skeleton height={69} />
      <Skeleton height={69} />
      <div className="mt-5"></div>
      <Skeleton width={100} height={10} />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}