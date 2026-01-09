import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { CategoriesTopCourses, Category } from '../types/category';

export async function getCategories(axiosInstance: AxiosInstance): Promise<Category[]> {
  const res = await axiosInstance.get('/categories');
  return res.data.data.categories;
}

export async function getCategoriesTopCourses(axiosInstance: AxiosInstance): Promise<CategoriesTopCourses[]> {
  const res = await axiosInstance.get('/categories/popular');
  return res.data.data.categories;
}

export async function getCategory(axiosInstance: AxiosInstance , id: any): Promise<Category> {
  const res = await axiosInstance.get(`/categories/${id}`);
  return res.data.data.category;
}

export async function deleteCategory(axiosInstance: AxiosInstance, categorySlug: string): Promise<void> {
  await axiosInstance.delete(`/categories/${categorySlug}`);
}

export function useDeleteCategory(axiosInstance: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await deleteCategory(axiosInstance, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
}