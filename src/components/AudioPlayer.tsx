import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();

  //pause or play
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  //song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleSongEnded = () => {
      playNext();
    };

    audio?.addEventListener("ended", handleSongEnded);

    return () => {
      audio?.removeEventListener("ended", handleSongEnded);
    };
  }, [playNext]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      audio.currentTime = 0; // song time to 0 if song changes
      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) {
        audio.play();
      }
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

//song paused or changes
export default AudioPlayer;
