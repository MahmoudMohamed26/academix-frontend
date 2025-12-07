import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { Category } from '../types/category';

export async function getCategories(axiosInstance: AxiosInstance): Promise<Category[]> {
  const res = await axiosInstance.get('/categories');
  return res.data;
}

export async function deleteCategory(axiosInstance: AxiosInstance, categoryId: string): Promise<void> {
  await axiosInstance.delete(`/categories/${categoryId}`);
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