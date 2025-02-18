export enum VideoService {
  YouTube = 'youtube',
  Vimeo = 'vimeo',
}

export interface VideoDetails {
  id: string;
  service: VideoService;
  embedUrl: string;
  thumbnailUrl?: string;
}

// See https://stackoverflow.com/a/37704433
export const YOUTUBE_URL_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?(youtube(-nocookie)?\.com|youtu.be)(\/(?:[\w-]+\?v=|embed\/|live\/|v\/)?)([\w-]+)(\S+)?$/;

/**
 * Match Vimeo video URLs, and captures the video ID and the optional video hash ID (security measure):
 * - https://vimeo.com/915510074
 * - https://vimeo.com/915510074?share=copy
 * - https://vimeo.com/915510074/010caf4de8
 * - https://vimeo.com/915510074/010caf4de8?share=copy
 */
export const VIMEO_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?vimeo.com\/(\d+)(?:\/([0-9a-zA-Z]+))?(?:\?.*)?$/;
