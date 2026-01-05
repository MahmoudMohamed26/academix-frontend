import { AxiosInstance } from "axios";
import { Review, ReviewRes } from "../types/review";

export async function getReviews(axiosInstance: AxiosInstance, course_id: any): Promise<ReviewRes> {
  const res = await axiosInstance.get(`/courses/${course_id}/reviews`);
  return res.data.data;
}