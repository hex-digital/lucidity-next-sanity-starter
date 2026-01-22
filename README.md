<a id="readme-top"></a>

> This repo is a work in progress. Star 🌟 and subscribe to Releases 🏷️ to keep up to date.  
> We're working on the Sanity app and toolkit first, so it's currently bring-your-own-frontend.

<p></p>

<div align="center">
  <a href="https://github.com/hex-digital/lucidity-next-sanity-starter">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./docs/lucidity-light.svg">
      <img alt="Lucidity Logo" src="./docs/lucidity.svg">
    </picture>
  </a>

  <p align="center">
    The Enterprise-Ready Next.js 15 + SanityCMS Starter
    <br />
    <a href="https://github.com/hex-digital/lucidity-next-sanity-starter/blob/main/docs">
      <strong>Explore the docs »</strong>
    </a>
    <br />
    <br />
  </p>
</div>

<div align="center">
  
  [![CI Packages][ci-packages-shield]][ci-packages-url]
  [![Codefactor][codefactor-shield]][codefactor-url]
  [![Maintainability][maintainability-shield]][maintainability-url]
  [![TechDebt][tech-debt-shield]][tech-debt-url]
  [![Codacy][codacy-shield]][codacy-url]
  [![Top Language][top-lang-shield]][top-lang-url]
  [![License][license-shield]][license-url]
  [![FOSSA Security Status][fossa-security-shield]][fossa-security-url]
  [![FOSSA License Status][fossa-license-shield]][fossa-license-url]

</div>

<div align="center">
  <p align="center" style="font-size: smaller">
    <!--<a href="https://github.com/hex-digital/lucidity-next-sanity-starter">View Demo</a>
    ·
    --><a href="https://github.com/hex-digital/lucidity-next-sanity-starter/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/hex-digital/lucidity-next-sanity-starter/issues/new?labels=enhancement">Request Feature</a>
    <br/>
    <br/>
  </p>

  <p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#how-to-use">How To Use</a> •
    <a href="#sites-powered-by-lucidity">Demos</a> •
    <a href="#credits">Credits</a> •
    <a href="#support">Support</a> •
    <a href="#license">License</a>
  </p>
</div>

## Sponsors

If you are using and enjoying some of my open source work in your company, I'd really appreciate a [sponsorship](https://github.com/sponsors/jamiewarb), a [coffee](https://ko-fi.com/jamiewarb) or just dropping a star on this repo 🌟.

It really helps me to keep going and to continue to maintain and improve this project.

### Special thanks to

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/liamb13" target="_blank">
         <img width="65" src="https://avatars.githubusercontent.com/u/69778531?v=4" alt="Liam Barr" />
      </a>
    </td>
    <td align="center">
      <a href="https://www.hexdigital.com/?utm_source=lucidity-repo&utm_medium=sponsors&utm_campaign=github" target="_blank">
         <img width="65" src="https://avatars.githubusercontent.com/u/17425446?v=4" alt="Liam Barr" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/liamb13" target="_blank">Liam Barr</a>
    </td>
    <td align="center">
      <a href="https://www.hexdigital.com/?utm_source=lucidity-repo&utm_medium=sponsors&utm_campaign=github" target="_blank">Hex Digital</a>
    </td>
  </tr>
</table>

## Key Features

A turn-key application for Next.js 15 and Sanity CMS. The project is designed to be a starting point for enterprise-ready applications, with a focus on performance, security, and maintainability.

- Editorial functionality
  - Pages and Articles
  - Live Previews and Visual Editing
  - Sitemap-style Page Navigator
  - Flexible Modular Content Blocks
  - Powerful Redirects; automatic redirect creation on URL changes
  - In-CMS Form Builder and Submission Handling
- SEO
  - Global and Per-Page Metadata
  - Sitemap
  - RSS/JSON Feed
  - Robots.txt and Humans.txt
- Internationalisation
  - Support for single language and multiple languages out of the box
- Security
  - CORS
  - Security Headers
- Accessibility
  - Accessible by design, with a focus on WCAG 2.2 AA
- Performance
  - Image Optimisation
  - Next.js 15 Caching Integration and Revalidation
  - Lighthouse Scores
- Monitoring + Tracking
  - Optional integrations with:
    - Sentry
    - Google Analytics
    - Feedbucket
  - And the easy adoption of more
- Development
  - Solid Dev Tooling: linting; type checking; testing; CI/CD;
  - Sanity Toolkit: utility functions, validation rules, hidden/readOnly functions, schema components
  - Monorepo with maintainable structure and clean code, inspired by Bulletproof React

Requires:

- Node > 20.11.0

## How to Use

Either fork this repo or use the GitHub Template:

<a href="https://github.com/new?template_name=lucidity-next-sanity-starter&template_owner=hex-digital">
  <img alt="Use this template" src="./docs/use-this-template.png" width="138">
</a>

Install dependencies using `pnpm install`.

Run the dev servers for Next.js and Sanity with `pnpm g:dev`.

For more detailed instructions, see the [Getting Started](./docs/index.md) guide.

## Sites powered by Lucidity

- [https://www.toogoodtogo.com](https://www.toogoodtogo.com)
- [https://datazone.birdlife.org](https://datazone.birdlife.org)
- [https://www.atomos.co.uk](https://www.atomos.co.uk)
- [https://www.conservation.org](https://www.conservation.org)

Send in a PR with your own addition

## Credits

The project takes inspiration from two main sources:

- [Bulletproof React repo](https://github.com/alan2207/bulletproof-react)
- [Belgattitude Monorepo Example](https://github.com/belgattitude/nextjs-monorepo-example)

And thank you to [Saskia](https://github.com/bobinska-dev), [Knut](https://github.com/kmelve) and [Simeon](https://github.com/simeongriggs) for their wealth of Sanity knowledge and endless generosity with their time.

## Support

Do you need support with Lucidity, Sanity, Next.js or Nuxt?

[Hex Digital](https://www.hexdigital.com?utm_source=lucidity-repo&utm_medium=support&utm_campaign=github) is a digital experience and product agency that works with start-ups and established businesses.

We're trusted to be the core technical team behind their projects. We have a key focus on mentoring, to ensure the practices we bring in are adopted by the internal team before our collaboration is over.

Feel free to email me at jamie [at] hexdigital [dot] com, or [get in touch via our website](https://www.hexdigital.com/contact?utm_source=lucidity-repo&utm_medium=support&utm_campaign=github) to discuss your project.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter?ref=badge_large)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[ci-packages-shield]: https://github.com/hex-digital/lucidity-next-sanity-starter/actions/workflows/ci-packages.yml/badge.svg?label=CI%20Packages&logo=github&style=flat-square
[ci-packages-url]: https://github.com/hex-digital/lucidity-next-sanity-starter/actions?query=workflow%3A%22CI+Packages%22
[codefactor-shield]: https://img.shields.io/codefactor/grade/github/hex-digital/lucidity-next-sanity-starter?label=Codefactor&logo=codefactor&style=flat-quare&labelColor=000000
[codefactor-url]: https://www.codefactor.io/repository/github/hex-digital/lucidity-next-sanity-starter
[maintainability-shield]: https://img.shields.io/codeclimate/maintainability/hex-digital/lucidity-next-sanity-starter?label=Maintainability&logo=code-climate&style=flat-quare&labelColor=000000
[maintainability-url]: https://codeclimate.com/github/hex-digital/lucidity-next-sanity-starter
[tech-debt-shield]: https://img.shields.io/codeclimate/tech-debt/hex-digital/lucidity-next-sanity-starter?label=TechDebt&logo=code-climate&style=flat-quare&labelColor=000000
[tech-debt-url]: https://codeclimate.com/github/hex-digital/lucidity-next-sanity-starter
[codacy-shield]: https://img.shields.io/codacy/grade/dff9c944af284a0fad4e165eb1727467?logo=codacy&style=flat-square&labelColor=000&label=Codacy
[codacy-url]: https://app.codacy.com/gh/hex-digital/lucidity-next-sanity-starter/dashboard?utm_source=github.com&utm_medium=referral&utm_content=hex-digital/lucidity-next-sanity-starter&utm_campaign=Badge_Grade
[top-lang-shield]: https://img.shields.io/github/languages/top/hex-digital/lucidity-next-sanity-starter?style=flat-square&labelColor=000&color=blue
[top-lang-url]: https://github.com/hex-digital/lucidity-next-sanity-starter/search?l=typescript
[license-shield]: https://img.shields.io/github/license/hex-digital/lucidity-next-sanity-starter?style=flat-quare&labelColor=000000
[license-url]: https://github.com/hex-digital/lucidity-next-sanity-starter/blob/main/LICENSE
[fossa-security-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter.svg?type=shield&issueType=security
[fossa-security-url]: https://app.fossa.com/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter?ref=badge_shield&issueType=security
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter.svg?type=shield&issueType=license
[fossa-license-url]: https://app.fossa.com/projects/git%2Bgithub.com%2Fhex-digital%2Flucidity-next-sanity-starter?ref=badge_shield&issueType=license
