import { AxiosInstance } from "axios";
import { Lecture, LectureUrl } from "../types/lecture";

export async function getLectureData(axiosInstance: AxiosInstance , courseId: any, sectionId: any, lectureId: any): Promise<Lecture> {
  const res = await axiosInstance.get(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`);
  return res.data.data.lecture;
}

export async function getLectureVideo(axiosInstance: AxiosInstance , courseId: any, sectionId: any, lectureId: any): Promise<LectureUrl> {
  const res = await axiosInstance.get(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}/video`);
  return res.data.data.video_url;
}