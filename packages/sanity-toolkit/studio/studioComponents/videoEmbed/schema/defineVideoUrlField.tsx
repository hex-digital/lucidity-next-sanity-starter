import { defineField } from 'sanity';
import { YOUTUBE_URL_REGEX, VIMEO_URL_REGEX } from '@pkg/utilities/video/types';
import { FaRegFileVideo } from 'react-icons/fa';
import { VideoService } from '../constants';
import { VideoInput } from '../components/VideoInput';

export function defineVideoUrlField({
  name,
  title,
  description,
  isRequired = false,
}: {
  name: string;
  title: string;
  description?: string;
  isRequired?: boolean;
}) {
  return defineField({
    name,
    title,
    type: 'object',
    description,
    icon: FaRegFileVideo,
    fields: [
      defineField({
        name: 'url',
        title: 'Video URL',
        type: 'string',
        description: 'Enter a YouTube or Vimeo URL',
        validation: (rule) => {
          const regexRule = rule.custom((url) => {
            if (!url) return true;
            if (YOUTUBE_URL_REGEX.test(url) || VIMEO_URL_REGEX.test(url)) return true;
            return 'Please enter a valid YouTube or Vimeo URL';
          });
          return isRequired ? regexRule.required() : regexRule;
        },
      }),
      defineField({
        name: 'shouldFetchThumbnail',
        title: 'Retrieve thumbnail',
        type: 'boolean',
        initialValue: true,
      }),
      defineField({
        name: 'id',
        title: 'Video ID',
        type: 'string',
        readOnly: true,
      }),
      defineField({
        name: 'service',
        title: 'Service',
        type: 'string',
        readOnly: true,
        options: {
          list: [
            { title: 'YouTube', value: VideoService.YouTube },
            { title: 'Vimeo', value: VideoService.Vimeo },
          ],
        },
      }),
      defineField({
        name: 'embedUrl',
        title: 'Embed URL',
        type: 'string',
        readOnly: true,
      }),
      defineField({
        name: 'thumbnailUrl',
        title: 'Thumbnail URL',
        type: 'string',
        readOnly: true,
      }),
    ],
    components: {
      input: VideoInput,
    },
    preview: {
      select: {
        url: 'url',
        thumbnailUrl: 'thumbnailUrl',
        service: 'service',
      },
      prepare({ url, thumbnailUrl, service }) {
        return {
          title: url || 'No URL set',
          subtitle: service ? `Service: ${service}` : undefined,
          media: thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : FaRegFileVideo,
        };
      },
    },
  });
}
