import { AxiosInstance } from "axios";
import { EnrollmentslRes } from "../types/enrolls";

export async function getEnrollments(axiosInstance: AxiosInstance, param?: any): Promise<EnrollmentslRes> {
  console.log(param);
  const res = await axiosInstance.get(`/courses/enrolled?page=${param}`);
  return res.data.data;
}