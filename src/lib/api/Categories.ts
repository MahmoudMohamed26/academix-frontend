import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { Category } from '../types/category';

export async function getCategories(axiosInstance: AxiosInstance): Promise<Category[]> {
  const res = await axiosInstance.get('/category');
  return res.data.data.categories;
}

export async function deleteCategory(axiosInstance: AxiosInstance, categorySlug: string): Promise<void> {
  await axiosInstance.delete(`/category/${categorySlug}`);
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