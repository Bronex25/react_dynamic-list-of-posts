import { Post } from '../types/Post';
import { User } from '../types/User';
import { client } from '../utils/fetchClient';

export const getPosts = (userId: number) => {
  return client.get<Post[]>(`/posts?userId=${userId}`);
};

export const getUsers = () => {
  return client.get<User[]>(`/users`);
};

export const addPost = ({ userId, title, body }: Omit<Post, 'id'>) => {
  return client.post<Post>('/posts', { userId, title, body });
};

export const deletePost = (id: number) => {
  return client.delete(`/posts/${id}`);
};

export const updateTodo = ({ id, ...todoData }: Post) => {
  return client.patch<Post>(`/posts/${id}`, todoData);
};
