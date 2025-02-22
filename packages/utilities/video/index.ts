import { VIMEO_URL_REGEX, YOUTUBE_URL_REGEX } from './types';

export enum VideoEmbedVariant {
  Inline = 'inline',
  Background = 'background',
}

export const getYoutubeVideoId = (url: string) => {
  const match = url.match(YOUTUBE_URL_REGEX);

  if (match?.[6] != null) {
    return match[6];
  }

  return null;
};

interface GetYoutubeEmbedUrlOptions {
  youtubeVideoId: string;
  variant?: VideoEmbedVariant;
}

export const getYoutubeEmbedUrl = ({
  youtubeVideoId,
  variant = VideoEmbedVariant.Inline,
}: GetYoutubeEmbedUrlOptions) => {
  const url = `https://www.youtube.com/embed/${youtubeVideoId}`;
  const params = new URLSearchParams({
    modestbranding: '1',
    playlist: youtubeVideoId,
    rel: '0',
    controls: '1',
  });

  if (variant === VideoEmbedVariant.Background) {
    params.set('mute', '1');
    params.set('autoplay', '1');
    params.set('loop', '1');
    params.set('controls', '0');
  }

  return `${url}?${params.toString()}`;
};

interface GetVimeoEmbedUrlOptions {
  vimeoVideoId: string;
  variant?: VideoEmbedVariant;
  vimeoHashId?: string;
}

export const getVimeoEmbedUrl = ({
  vimeoVideoId,
  variant = VideoEmbedVariant.Inline,
  vimeoHashId,
}: GetVimeoEmbedUrlOptions) => {
  const url = `https://player.vimeo.com/video/${vimeoVideoId}`;
  const params = new URLSearchParams({
    title: 'false',
    byline: 'false',
    portrait: 'false',
  });

  if (vimeoHashId) {
    params.set('h', vimeoHashId);
  }

  if (variant === VideoEmbedVariant.Background) {
    params.set('background', 'true');
    params.set('muted', 'true');
    params.set('autoplay', 'true');
    params.set('loop', 'true');
    params.set('dnt', 'true'); // Remove tracking information, and therefore the JS and cookies required to track user views
  }

  return `${url}?${params.toString()}`;
};

interface GetVideoEmbedUrlOptions {
  videoUrl: string;
  variant?: VideoEmbedVariant;
}

export const getVideoEmbedUrl = ({ videoUrl, variant }: GetVideoEmbedUrlOptions) => {
  if (YOUTUBE_URL_REGEX.test(videoUrl)) {
    const youtubeVideoId = getYoutubeVideoId(videoUrl);

    if (youtubeVideoId == null) {
      throw new Error(`Invalid Youtube URL: ${videoUrl}`);
    }

    return getYoutubeEmbedUrl({ youtubeVideoId, variant });
  }

  if (VIMEO_URL_REGEX.test(videoUrl)) {
    const match = videoUrl.match(VIMEO_URL_REGEX);

    if (match?.[1] == null) {
      throw new Error(`Invalid Vimeo URL: ${videoUrl}`);
    }

    const vimeoVideoId = match[1];
    const vimeoHashId = match[2];

    return getVimeoEmbedUrl({ vimeoVideoId, variant, vimeoHashId });
  }

  throw new Error(
    `Invalid video URL - must be either a Youtube or Vimeo link. Received: ${videoUrl}`,
  );
};
