import { defineQuery } from 'groq';

export function REDIRECTS_QUERY(schemaType: string, pathname?: string) {
  return defineQuery(`
    {
      'redirects': *[_type == "${schemaType}"][] {
        _id,
        from,
        link {
          linkType,
          pageAnchor,
          "page": page->{
            pageVisibility,
            'pathname': ${pathname ?? `coalesce(pathname.current, slug.current)`},
          },
          external,
        },
        isPermanent,
        group,
      },
      'retrievedOn': now(),
    }
  `);
}
