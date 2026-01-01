import { AxiosInstance } from 'axios';
import { User } from '../types/user';

export async function getUser(axiosInstance: AxiosInstance): Promise<User> {
  const res = await axiosInstance.get('/profile');
  return res.data.data.user;
}

export async function getProfile(axiosInstance: AxiosInstance, id: any): Promise<User> {
  const res = await axiosInstance.get(`/instructors/${id}`);
  return res.data.data.instructor;
}