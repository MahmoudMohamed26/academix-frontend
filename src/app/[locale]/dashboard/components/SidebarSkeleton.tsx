"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SidebarSkeleton() {
  return (
    <div className="mx-5">
      <Skeleton width={100} />
      <Skeleton width={150} />
      <Skeleton width={80} />
      <Skeleton />
      <Skeleton width={100} />
      <div className="mt-5"></div>
      <Skeleton height={69} />
      <Skeleton height={69} />
      <Skeleton height={69} />
      <Skeleton height={69} />
      <div className="mt-5"></div>
      <Skeleton width={100} />
      <Skeleton width={200} />
      <Skeleton width={80} />
      <Skeleton width={140} />
      <Skeleton width={180} />
      <Skeleton width={40} />
      <Skeleton width={80} />
      <Skeleton width={170} />
      <Skeleton width={140} />
      <Skeleton width={160} />
      <Skeleton width={110} />
    </div>
  );
}