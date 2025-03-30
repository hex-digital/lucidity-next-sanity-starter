import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type NextMiddlewareHandler<
  Request extends NextRequest = NextRequest,
  Response = NextResponse,
> = (
  request: Request,
  response: Response,
) => Promise<Response | undefined | void> | Response | undefined | void;

export function defineNextMiddleware<
  Request extends NextRequest = NextRequest,
  Response = NextResponse,
>(handler: NextMiddlewareHandler<Request, Response>) {
  return handler;
}

export async function runNextMiddlewarePipeline<Request extends NextRequest = NextRequest>(
  request: Request,
  middlewarePipeline: Array<NextMiddlewareHandler<Request>>,
) {
  let response = NextResponse.next();

  for (const middlewareHandler of middlewarePipeline) {
    const handlerResponse = await middlewareHandler(request, response);

    if (handlerResponse) {
      response = handlerResponse;
    }

    if (!response.ok) {
      // Redirects or Errors should break out of the pipeline immediately
      return response;
    }
  }

  return response;
}

export async function fetchJson<DataType>(apiUrl: URL): Promise<DataType> {
  const response = await fetch(apiUrl);

  if (response.ok) {
    return response.json() as Promise<DataType>;
  } else {
    throw new Error('Unable to request API');
  }
}

export function mergeQueryParams(
  url: string | URL,
  params: Record<string, string> | URLSearchParams,
) {
  try {
    const urlObj = new URL(url);

    const addParam = (key: string, value: string) => {
      urlObj.searchParams.set(key, value);
    };

    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => {
        addParam(key, value);
      });
    } else {
      Object.entries(params).forEach(([key, value]) => {
        addParam(key, value);
      });
    }

    return urlObj.toString();
  } catch {
    console.error('Error adding query parameters');
    return url;
  }
}
