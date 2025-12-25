import { AxiosInstance } from "axios";

export async function getQuestions(axiosInstance: AxiosInstance , courseId: string, sectionId: string, quizId: string){
  const res = await axiosInstance.get(`/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}/questions`);
  return res.data.data.Questions;
}