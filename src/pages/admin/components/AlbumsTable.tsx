import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";

const AlbumsTable = () => {
  const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    console.log({ albums });
  }, [fetchAlbums]);
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50 ">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {albums.map((data) => (
          <TableRow key={data._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img src={data.imageUrl} alt={data.title} className="size-10 rounded object-cover" />
            </TableCell>
            <TableCell className="font-medium">{data.title}</TableCell>
            <TableCell>{data.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="size-4" />
                {data.releaseDate.toString().split("T")[0]}
              </span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Music className="size-4" />
                {data.songs.length} songs
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => deleteAlbum?.(data._id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlbumsTable;
