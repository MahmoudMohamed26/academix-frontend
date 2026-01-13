import { AxiosInstance } from "axios";
import { EnrollmentslRes } from "../types/enrolls";

export async function getEnrollments(axiosInstance: AxiosInstance): Promise<EnrollmentslRes> {
  const res = await axiosInstance.get(`/courses/enrolled`);
  return res.data.data;
}