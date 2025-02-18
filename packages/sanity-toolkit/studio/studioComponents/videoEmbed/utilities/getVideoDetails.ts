import { getYoutubeVideoId, getVideoEmbedUrl } from '@pkg/utilities/video';
import { YOUTUBE_URL_REGEX, VIMEO_URL_REGEX } from '@pkg/utilities/video/types';
import { type VideoDetails, VideoService } from '../constants';

export async function getVideoDetails(
  url: string,
  shouldFetchThumbnail: boolean,
): Promise<VideoDetails> {
  if (YOUTUBE_URL_REGEX.test(url)) {
    const id = getYoutubeVideoId(url);
    if (!id) throw new Error('Invalid YouTube URL');

    const details: VideoDetails = {
      id,
      service: VideoService.YouTube,
      embedUrl: getVideoEmbedUrl({ videoUrl: url }),
    };

    if (shouldFetchThumbnail) {
      details.thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }

    return details;
  }

  if (VIMEO_URL_REGEX.test(url)) {
    const match = url.match(VIMEO_URL_REGEX);
    if (!match?.[1]) throw new Error('Invalid Vimeo URL');

    const id = match[1];
    const details: VideoDetails = {
      id,
      service: VideoService.Vimeo,
      embedUrl: getVideoEmbedUrl({ videoUrl: url }),
    };

    if (shouldFetchThumbnail) {
      try {
        const response = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
        const data = (await response.json()) as Array<{ thumbnail_large: string }>;
        details.thumbnailUrl = data[0]?.thumbnail_large;
      } catch (error) {
        console.error('Failed to fetch Vimeo thumbnail:', error);
      }
    }

    return details;
  }

  throw new Error('Invalid video URL - must be either a YouTube or Vimeo link');
}
