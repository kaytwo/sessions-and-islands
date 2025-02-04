# Sessions and Server Islands Starter Kit: Basics

This is a demo of Astro's new Sessions feature and cacheable Server Islands
(added in [5.1.6](https://github.com/withastro/astro/pull/12960)) with an
example of how to make a maximally static full stack web application using
Astro.

This example uses Google Sign in, but should be adaptable to any other auth
provider. This code is a bit coupled to the popup sign in flow, but should be
able to be reworked to handle a redirect flow. PRs welcome!

In order to get started, you'll need to follow the [Create authorization
credentials](https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials)
instructions on this page to get a **Client ID** from Google, and then add
`http://localhost:4321` as an allowed origin.


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
