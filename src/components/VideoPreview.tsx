'use client';

import { useState } from 'react';

export default function VideoPreview({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = url.split('/embed/')[1]?.split('?')[0];
  if (playing) {
    return (
      <iframe
        src={url.replace('www.youtube.com', 'www.youtube-nocookie.com') + '?autoplay=1&mute=1&rel=0'}
        title={title}
        className="absolute inset-0 h-full w-full rounded-2xl"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button type="button" onClick={() => setPlaying(true)}
      aria-label={title + ' — videoyu oynat'}
      className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl bg-[#181818] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8CFC4]">
      {/* YouTube's public poster loads without starting its video player. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg'} alt=""
        width={480} height={360} loading="lazy" decoding="async"
        className="h-full w-full object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-xl">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
      <span className="absolute inset-x-4 bottom-5 text-center text-sm font-medium text-white">Videoyu izle</span>
    </button>
  );
}
