/**
 * Config for your Next application.
 * Do not import this into your Sanity application.
 *
 * For Vercel env vars, see: https://vercel.com/docs/projects/environment-variables/system-environment-variables
 */

const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const siteDomainAsBaseUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : undefined;
const vercelUrlAsBaseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const baseUrl = envBaseUrl ?? siteDomainAsBaseUrl ?? vercelUrlAsBaseUrl ?? '';

const sanityStudioUrl = checkValue(
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  'NEXT_PUBLIC_SANITY_STUDIO_URL',
  '',
);

export type AppConfig = typeof appConfig;

export const appConfig = {
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? process.env.VERCEL_URL ?? '',
  baseUrl: envBaseUrl ?? siteDomainAsBaseUrl ?? vercelUrlAsBaseUrl ?? '',

  // Not exposed to the front-end, used solely by the server
  dataSyncAuthToken: checkServerOnlyValue(
    process.env.SANITY_API_SYNC_AUTH_TOKEN,
    'SANITY_API_SYNC_AUTH_TOKEN',
    '',
  ),

  metadata: {
    noIndex: asBool(process.env.NEXT_PUBLIC_NO_INDEX, process.env.NODE_ENV !== 'production'),
  },

  security: {
    cors: {
      paths: ['api/*'],
      allowedMethods: ['*'],
      allowedOrigins: [baseUrl, sanityStudioUrl],
      allowedHeaders: [
        // Normal defaults included automatically
        'X-Built-By',
        'X-Redirected-From',
        'X-Redirected-By',
        'X-Redirects-Retrieved',
        'sanity-webhook-signature',
      ],
    },
  },

  sanity: {
    projectId: assertValue(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
    ),

    dataset: assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET, 'NEXT_PUBLIC_SANITY_DATASET'),

    workspace:
      process.env.NEXT_PUBLIC_SANITY_WORKSPACE ?? process.env.NEXT_PUBLIC_SANITY_DATASET,

    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-04-26',

    studioUrl: sanityStudioUrl,

    revalidateSecret: checkServerOnlyValue(
      process.env.SANITY_REVALIDATE_SECRET,
      'SANITY_REVALIDATE_SECRET',
      '',
    ),

    // Not exposed to the front-end, used solely by the server
    readToken: checkServerOnlyValue(
      process.env.SANITY_API_READ_TOKEN,
      'SANITY_API_READ_TOKEN',
      '',
    ),
    dataSyncToken: checkServerOnlyValue(
      process.env.SANITY_API_DATA_SYNC_WRITE_TOKEN,
      'SANITY_API_DATA_SYNC_WRITE_TOKEN',
      '',
    ),

    debugStega: asBool(process.env.NEXT_PUBLIC_SANITY_DEBUG_STEGA, false),
  },
  debug: {
    // Don't cache any requests to Sanity in Next's Data Cache (i.e. when using `fetch()` with a Sanity endpoint)
    sanityNoCache: asBool(
      process.env.NEXT_PUBLIC_DEBUG_SANITY_NO_CACHE,
      process.env.NODE_ENV === 'development',
    ),
  },
};

/**
 * Ensure the value is always a boolean, no matter what is in .env.
 * If "true" or "false" are in .env, get the corresponding boolean's TRUE or FALSE.
 */
function asBool(value?: string | boolean, defaultVal = true) {
  if (value === 'false' || value === false) {
    return false;
  }
  if (value === 'true' || value === true) {
    return true;
  }

  return defaultVal;
}

/**
 * Ensure the value is always an int, no matter what is in .env.
 * If value in .env is an integer as a string, get an integer, otherwise get the default value specified.
 */
function _asInt(value?: string, defaultVal?: number) {
  if (value) {
    return Number.parseInt(value);
  }

  return defaultVal ?? undefined;
}

function assertValue<T>(v: T | undefined, variableName: string): T {
  if (v === undefined) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }

  return v;
}

function checkValue<T>(v: T | undefined, variableName: string, fallback: T): T {
  if (v === undefined) {
    console.warn(`Missing environment variable: ${variableName}`);

    return fallback;
  }

  return v;
}

function checkServerOnlyValue<T>(v: T | undefined, variableName: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return checkValue(v, variableName, fallback);
  }

  if (v !== undefined) {
    console.warn(
      `Potential environment variable leak. Environment variable ${variableName} detected on client, but set in config as server only`,
    );
  }

  return fallback;
}
