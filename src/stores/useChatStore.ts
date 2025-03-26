import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface ChatStore {
  users: any[];
  fetchUsers: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/users");
      if (!response) {
        throw new Error("Failed to fetch users");
      }
      set({ users: response.data });
    } catch (error: any) {
      console.log("error", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
