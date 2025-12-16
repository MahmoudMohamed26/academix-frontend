import { AxiosInstance } from "axios";
import { Section } from "../types/section";

export async function getSections(axiosInstance: AxiosInstance , id: any): Promise<Section[]> {
  const res = await axiosInstance.get(`/courses/${id}/sections`);
  return res.data.data.sections;
}