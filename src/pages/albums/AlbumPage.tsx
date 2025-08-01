import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const albumTotalDuration = currentAlbum?.songs.reduce((acc: number, song) => acc + song.duration, 0);

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePlaySong = (index: number) => {
    if (!currentAlbum?.songs) return;
    playAlbum(currentAlbum?.songs, index);
  };

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);

    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        {/* <div className="relative min-h-full"> */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 rounded-md pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex p-6 gap-6 pb-8">
            <img
              src={currentAlbum?.imageUrl}
              alt={currentAlbum?.title}
              className="w-[240px] h-[240px] shadow-xl rounded"
            />

            <div className="flex flex-col justify-end">
              <p className="text-sm font-medium">Album</p>
              <h2 className="text-7xl font-bold my-4">{currentAlbum?.title}</h2>
              <div className="flex items-center gap-1 text-sm to-zinc-100 pb-1">
                <span className="font-medium text-white">{currentAlbum?.artist}</span>•
                <span>{moment(currentAlbum?.releaseDate).format("YYYY")}</span>•
                <span>{currentAlbum?.songs.length} songs</span>•<span>{formatDuration(albumTotalDuration || 0)}</span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-4 flex items-center gap-6">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-green-500 hover:scale-105 hover:bg-green-600 transition-all"
              onClick={handlePlayAlbum}
            >
              {isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                <Pause className="h-7 w-7 text-black fill-black" />
              ) : (
                <Play className="h-7 w-7 text-black fill-black" />
              )}
            </Button>
          </div>

          <div className="bg-black/20 backdrop-blur-sm">
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
              <div>#</div>
              <div>Title</div>
              <div>Released Date</div>
              <div>
                <Clock className="size-4" />
              </div>
            </div>

            <div className="px-6">
              <div className="space-y-2 py-4">
                {currentAlbum?.songs.map((song, index) => {
                  const isCurrentSong = currentSong?._id === song._id;
                  return (
                    <div
                      key={song._id}
                      onClick={() => handlePlaySong(index)}
                      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        {isCurrentSong && isPlaying ? (
                          <div className="size-4 text-green-500">♫</div>
                        ) : (
                          <span className="group-hover:hidden">{index + 1}</span>
                        )}
                        {!isCurrentSong && <Play className="size-4 hidden group-hover:block " />}
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={song.imageUrl} alt={song.title} className="size-10" />

                        <div>
                          <div className="font-medium text-white">{song.title}</div>
                          <div>{song.artist}</div>
                        </div>
                      </div>

                      <div className="flex items-center">{song.createdAt.split("T")[0]}</div>

                      <div className="flex items-center">{formatDuration(song.duration)}</div>

                      {/* <span>{song.title}</span>
                    <span>{song.title}</span> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
