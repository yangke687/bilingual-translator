'use client';

import YouTube from 'react-youtube';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VideoPlayerModalProps {
  videoId: string;
  startTime: number;
  word: string;
  open: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ videoId, startTime, word, open, onClose }: VideoPlayerModalProps) {
  const opts = {
    playerVars: {
      autoplay: 1,
      start: startTime,
      end: startTime + 20,
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-black">
        <div className="bg-primary text-primary-foreground p-3 text-center text-lg font-semibold">
          {word}
        </div>
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full aspect-video"
          iframeClassName="w-full h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
