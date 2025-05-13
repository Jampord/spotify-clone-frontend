export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  songs: Song[];
  releaseDate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalArtists: number;
  totalUsers: number;
}
