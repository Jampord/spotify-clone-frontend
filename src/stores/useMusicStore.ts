import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  deleteSong: (id: string) => Promise<void>;
  deleteAlbum?: (id: string) => Promise<void>;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    totalUsers: 0,
  },

  deleteSong: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.delete(`/admin/songs/${id}`);
      if (!response) {
        throw new Error("Failed to delete song");
      }
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));

      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete song");
      console.log("Error deleting song:", error);
      set({ error: error.response?.data?.message || "Failed to delete song" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.delete(`/admin/albums/${id}`);
      if (!response) {
        throw new Error("Failed to delete album");
      }
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
        ),
      }));

      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album");
      console.log("Error deleting album:", error);
      set({ error: error.response?.data?.message || "Failed to delete album" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/albums");
      if (!response) {
        throw new Error("Failed to fetch albums");
      }
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (albumId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/albums/${albumId}`);
      if (!response) {
        throw new Error("Failed to fetch album");
      }
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/songs/featured");
      if (!response) {
        throw new Error("Failed to fetch featured songs");
      }
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/songs/made-for-you");
      if (!response) {
        throw new Error("Failed to fetch made for you songs");
      }
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/songs/trending");
      if (!response) {
        throw new Error("Failed to fetch trending songs");
      }
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/songs");
      if (!response) {
        throw new Error("Failed to fetch songs");
      }
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/stats");
      if (!response) {
        throw new Error("Failed to fetch stats");
      }
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
