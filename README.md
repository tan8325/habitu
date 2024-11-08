### NextJS, Convex, Clerk, ShadCN
### Cloning the repository

```shell
git clone https://github.com/tan8325/habitu.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

```
### Setup .auth.config.ts file

```js
create a file at convex/auth.config.ts
input clerk JWT issuer link

export default {
  providers: [
    {
      domain: "clerk issuer name",
      applicationID: "convex",
    },
  ]
};

```

### Setup Convex

```shell
npx convex dev

```
### Start the app

```shell
npm run dev
```