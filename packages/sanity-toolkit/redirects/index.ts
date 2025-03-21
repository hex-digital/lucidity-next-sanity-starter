import { REDIRECT_TYPE, PERMANENT_REDIRECT_CODE, TEMPORARY_REDIRECT_CODE } from './constants';
import type { Redirect, RedirectMatchResult, RedirectsQueryPayload } from './types';
import { skipFileExtensions } from './config';
import { combinePathAndQuery, constructRedirectUrl, patternToRegex } from './utilities';

export async function redirectResolver(
  path: string,
  query: URLSearchParams | undefined,
  cmsRedirectsResolver: () => RedirectsQueryPayload | Promise<RedirectsQueryPayload>,
  incrementRedirectRuleCount?: (rule: Redirect) => void,
) {
  if (skipFileExtensions.some((skipExtension) => path.endsWith(skipExtension))) {
    return;
  }

  const { redirects, retrievedOn } = await cmsRedirectsResolver();

  const { matches, matchedRule, redirectUrl } = matchPathWithRules(path, redirects);

  if (matches && matchedRule && redirectUrl) {
    if (incrementRedirectRuleCount) {
      incrementRedirectRuleCount(matchedRule); // We don't await this as we don't care if it happens or not, and don't want to delay page load
    }

    const finalPath = combinePathAndQuery(redirectUrl, query);

    const code = matchedRule.isPermanent ? PERMANENT_REDIRECT_CODE : TEMPORARY_REDIRECT_CODE;

    return { path: finalPath, code, retrievedOn };
  }

  return undefined;
}

function matchPathWithRules(path: string, redirects: Array<Redirect>): RedirectMatchResult {
  const notFound = { matches: false };

  for (const rule of redirects) {
    try {
      const pattern = rule.from;
      const redirectUrl =
        rule.link?.linkType === REDIRECT_TYPE.DIRECT_PAGE
          ? rule.link?.page?.pathname
          : rule.link?.external;

      if (!redirectUrl || !pattern) {
        return notFound;
      }

      const regex = patternToRegex(pattern);
      const match = path.match(regex);

      if (match) {
        return {
          matches: true,
          matchedRule: rule,
          redirectUrl: constructRedirectUrl(match, redirectUrl),
        };
      }
    } catch (error) {
      // Just continue if any errors, we will just ignore them as no need to hold up loading the page for this
      console.log(error);
      // @todo re-add when Sentry is added
      // @todo move this to a error handler that is passed in as config
      // withScope(function (scope) {
      //   scope.setTag('section', 'redirects');
      //   scope.setContext('redirectData', {
      //     path,
      //     redirectRuleId: rule._id,
      //   });
      //   captureException(error);
      // });
    }
  }

  return notFound;
}
