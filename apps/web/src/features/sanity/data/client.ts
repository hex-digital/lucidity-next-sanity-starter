import { type ClientPerspective, createClient } from 'next-sanity';
import { appConfig } from '@/config/app';

const clientConfig = {
  projectId: appConfig.sanity.projectId,
  dataset: appConfig.sanity.dataset,
  apiVersion: appConfig.sanity.apiVersion,
  useCdn: !appConfig.sanity.revalidateSecret,
  perspective: 'published' as ClientPerspective,
};

export const client = createClient({
  ...clientConfig,
  stega: {
    studioUrl: `${appConfig.sanity.studioUrl}/${appConfig.sanity.workspace}`,
    logger: appConfig.sanity.debugStega ? console : undefined, // Log out encoded and skipped paths to help debug
  },
});
