import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL;
const socket = io(baseUrl, {
  autoConnect: false, //only connect if user is authenticated
  withCredentials: true,
});

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string> | null;
  userActivities: Map<string, any> | null;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

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

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        const onlineUsers = new Set(users);
        set({ onlineUsers });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({
          userActivities: new Map(activities),
        });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set(state.onlineUsers).add(userId),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const updatedUsers = new Set(state.onlineUsers);
          updatedUsers.delete(userId);
          return { onlineUsers: updatedUsers };
        });
      });

      socket.on("message_received", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const updatedActivities = new Map(state.userActivities);
          updatedActivities.set(userId, activity);
          return { userActivities: updatedActivities };
        });
      });

      set({ socket, isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineUsers: new Set(), userActivities: new Map() });
    }
  },

  sendMessage: (senderId, receiverId, content) => {
    const socket = get().socket;

    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    socket.emit("send_message", { senderId, receiverId, content });
  },

  fetchMessages: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      if (!response) {
        throw new Error("Failed to fetch messages");
      }
      set({ messages: response.data });
    } catch (error: any) {
      console.log("Error fetching messages:", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
