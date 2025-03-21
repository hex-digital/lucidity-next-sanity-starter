import type { SanityClient } from 'sanity';
import type { Redirect } from '../types';

export function incrementRedirectRuleCountFn(client: SanityClient, sanityToken: string) {
  return function incrementRedirectRuleCount(rule: Redirect) {
    return;

    /**
     * Currently disabled as updating the record invalidates the redirects cache - see: https://hexdigital.slack.com/archives/C06BB8DAU7M/p1722859594907949
     * Instead, we should store the count in a separate record, so the actual redirects don't update.
     * Then show the count on each redirect using a custom UI component in Sanity.
     */
    // const ruleId = rule._id;

    // if (!ruleId) {
    //   console.error('Count not increment redirect rule count - no rule _id found');
    //   return;
    // }

    // client
    //   .withConfig({ token: sanityToken })
    //   .patch(ruleId)
    //   .inc({ count: 1 })
    //   .commit()
    //   .catch((err: unknown) => {
    //     console.error(err);
    //   });

    // @todo re-add when Sentry is added
    // @todo move this to a error handler that is passed in as config
    // .catch((error) => {
    //   withScope(function (scope) {
    //     scope.setTag('section', 'redirects');
    //     scope.setContext('redirectData', {
    //       message: `Error incrementing redirect rule count with ID ${ruleId}`,
    //       redirectRuleId: rule._id,
    //     });
    //     captureException(error);
    //   });
    // });
  };
}
