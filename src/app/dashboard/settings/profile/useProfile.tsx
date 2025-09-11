import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/service/axiosInstance";

const postUploadAvatar = async (data: any) => {
  const res = await axios
    .post("artist/upload/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res;
    });

  return res;
};

export const useUploadAvatar = () => {
  return useMutation((data: any) => postUploadAvatar(data), {});
};

const postUploadBanner = async (data: any) => {
  const res = await axios
    .post("artist/upload/banner", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res;
    });

  return res;
};

export const useUploadBanner = () => {
  return useMutation((data: any) => postUploadBanner(data), {});
};

const getProfile = async () => {
  try {
    const res = await axios.get("artist/profile");
    console.log(res);
    return res;
  } catch (error) {
    // If 401 or any auth error, throw it to let React Query handle it
    if (error.response?.status === 401) {
      throw new Error('Unauthorized');
    }
    // For other errors, re-throw to let React Query handle retries
    throw error;
  }
};

export const useGetProfile = (options?: any) => {
  return useQuery(["profile"], getProfile, {
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message === 'Unauthorized') {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    // Set data to null on auth errors
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        console.log('User not authenticated');
      }
    },
    ...options,
  });
};

const putUpdateProfile = async (data: any) => {
  const res = await axios.put("artist/profile", data).then((res) => {
    return res;
  });

  return res;
};

export const useUpdateProfile = () => {
  return useMutation((data: any) => putUpdateProfile(data), {});
};
