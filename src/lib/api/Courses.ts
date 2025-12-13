import { AxiosInstance } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "../types/course";

export async function getCourses(axiosInstance: AxiosInstance): Promise<Course[]> {
  const res = await axiosInstance.get('/course');
  return res.data.data.courses;
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