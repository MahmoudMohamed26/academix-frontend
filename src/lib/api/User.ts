import { AxiosInstance } from 'axios';
import { User } from '../types/user';

export async function getUser(axiosInstance: AxiosInstance): Promise<User> {
  const res = await axiosInstance.get('/profile');
  return res.data.data.user;
}