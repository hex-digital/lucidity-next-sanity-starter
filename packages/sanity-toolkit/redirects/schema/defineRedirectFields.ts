import { defineField } from 'sanity';
import { AiOutlineWarning } from 'react-icons/ai';
import { REDIRECT_TYPE } from '../constants';
import { isDeveloperOrAdmin } from '../../studio/utilities/roles';
import {
  linkMustBeRelativeOrAbsolute,
  mustStartWith,
  requiredIfParentIs,
  shouldBeInternalLink,
  validUrl,
} from '../../studio/schema/validation';

export function defineRedirectFields(internalLinkTypes: Array<string>) {
  return [
    defineField({
      title: 'Redirect sources',
      description:
        'The incoming source path should not include the protocol or domain (https://domain.com). It must start with a "/". These are all valid: /path, /path/:slug, /path/:slug* and /path/(?!uk/).*',
      name: 'redirectNote',
      type: 'note',
      options: {
        icon: AiOutlineWarning,
        tone: 'caution',
      },
    }),
    defineField({
      title: 'From path (slug)',
      name: 'from',
      type: 'string',
      description: 'The incoming source path to match, e.g. "/path/to/page"',
      validation: (rule) => [rule.required(), rule.custom(mustStartWith('/')).error()],
    }),
    defineField({
      title: 'Link',
      name: 'link',
      type: 'object',
      fieldsets: [
        {
          name: 'anchor',
          title: 'Link to portion of page (anchor link)',
          description: 'Optional',
          hidden: ({ parent }: { parent?: { linkType?: REDIRECT_TYPE } }) =>
            parent?.linkType !== REDIRECT_TYPE.DIRECT_PAGE,
          options: {
            collapsible: true,
            collapsed: true,
          },
        },
      ],
      fields: [
        defineField({
          title: 'Link Type',
          name: 'linkType',
          type: 'string',
          description:
            'Use "Page" to choose a page from the CMS. Its URL will be kept up-to-date if it changes. Otherwise use "Link" to enter a full URL.',
          initialValue: REDIRECT_TYPE.DIRECT_PAGE,
          options: {
            layout: 'radio',
            list: [
              { title: 'Page', value: REDIRECT_TYPE.DIRECT_PAGE },
              { title: 'Link', value: REDIRECT_TYPE.LINK },
            ],
          },
        }),

        /* Internal */
        defineField({
          title: 'Page',
          name: 'page',
          type: 'reference',
          weak: true,
          to: internalLinkTypes.map((docType) => ({ type: docType })),
          hidden: ({ parent }: { parent?: { linkType?: REDIRECT_TYPE } }) =>
            parent?.linkType !== REDIRECT_TYPE.DIRECT_PAGE,
          validation: (rule) =>
            rule.custom(requiredIfParentIs({ linkType: REDIRECT_TYPE.DIRECT_PAGE })).error(),
        }),
        defineField({
          title: 'Anchor tag',
          name: 'pageAnchor',
          type: 'string',
          description:
            'Enter an element "id" from the page. Do not start with "#". E.G. "section-one"',
          fieldset: 'anchor',
        }),

        /* External */
        defineField({
          title: 'Link to an external page',
          name: 'external',
          type: 'string',
          description:
            "Either use a full URL (e.g. https://mydomain.com) or start with a / for a page on the site (e.g. /blog). Use the Page type if you're just linking to an internal page with no regex",
          hidden: ({ parent }: { parent?: { linkType?: REDIRECT_TYPE } }) =>
            parent?.linkType !== REDIRECT_TYPE.LINK,
          validation: (rule) => [
            rule
              .custom((value) => !value || value.startsWith('/') || validUrl()(value))
              .error(),
            rule.custom(requiredIfParentIs({ linkType: REDIRECT_TYPE.LINK })).error(),
            rule.custom(linkMustBeRelativeOrAbsolute()).error(),
            rule.custom(shouldBeInternalLink()).warning(),
          ],
        }),
      ],
    }),
    defineField({
      title: 'Is this a permanent (308) redirect?',
      name: 'isPermanent',
      type: 'boolean',
      description:
        'Turn this off if the redirect is temporary and you intend on removing it in the future. Keeping this on may mean the page From path can never be used again. Test the redirect first before setting to Permanent.',
      initialValue: false,
    }),
    defineField({
      title: 'Group',
      name: 'group',
      type: 'string',
      description: 'Use groups to organise your redirects',
      options: {
        list: [
          { title: 'Redirections', value: 'redirections' },
          { title: 'Modified URLs', value: 'modifiedUrls' },
        ],
      },
      initialValue: 'redirections',
    }),
    defineField({
      title: 'Number of times redirected',
      name: 'count',
      type: 'number',
      initialValue: 0,
      readOnly: ({ currentUser }) => !isDeveloperOrAdmin(currentUser),
    }),

    // @todo This is not implemented in the server middleware, but is a good extensions for redirects
    //       Left here for a future addition
    // defineField({
    //   title: 'Advanced',
    //   name: 'advanced',
    //   type: 'object',
    //   description: 'Optional',
    //   options: {
    //     collapsible: true,
    //     collapsed: true,
    //   },
    //   fields: [
    //     defineField({
    //       title: 'Header, Cookie, Host or Query matching',
    //       name: 'matching',
    //       type: 'array',
    //       of: [
    //         {
    //           type: 'object',
    //           name: 'match',
    //           fields: [
    //             {
    //               type: 'string',
    //               title: 'Has or Missing',
    //               name: 'hasOrMissing',
    //               options: {
    //                 list: [
    //                   { title: 'Has', value: 'has' },
    //                   { title: 'Missing', value: 'missing' },
    //                 ],
    //               },
    //               initialValue: 'has',
    //             },
    //             {
    //               type: 'string',
    //               title: 'Type',
    //               name: 'type',
    //               options: {
    //                 list: [
    //                   { title: 'Header', value: 'header' },
    //                   { title: 'Cookie', value: 'cookie' },
    //                   { title: 'Host', value: 'host' },
    //                   { title: 'Query', value: 'query' },
    //                 ],
    //               },
    //               initialValue: 'has',
    //             },
    //             {
    //               type: 'string',
    //               title: 'Key',
    //               name: 'key',
    //             },
    //             {
    //               type: 'string',
    //               title: 'Value',
    //               name: 'value',
    //             },
    //           ]
    //         }
    //       ],
    //     })
    //   ],
    // })
  ];
}
