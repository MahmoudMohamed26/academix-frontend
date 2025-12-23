import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, CourseRes } from "../types/course";

export async function getCourses(axiosInstance: AxiosInstance): Promise<Course[]> {
  const res = await axiosInstance.get('/courses');
  console.log(res.data.data)
  return res.data.data.courses;
}

export async function getFilterdCourses(axiosInstance: AxiosInstance , url: string): Promise<CourseRes> {
  const res = await axiosInstance.get(url, {
    headers: {
      published: 'true'
    },
  });
  return res.data.data;
}

export async function getCourse(axiosInstance: AxiosInstance , id: any): Promise<Course> {
  const res = await axiosInstance.get(`/courses/${id}`);
  return res.data.data.course;
}

export async function deleteCourse(axiosInstance: AxiosInstance, courseId: string): Promise<void> {
  await axiosInstance.delete(`/courses/${courseId}`);
}

export function useDeleteCourse(axiosInstance: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      await deleteCourse(axiosInstance, courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
    },
  });
}