# Developer notes

- Component folder and file naming should be nested ie. navbar/navbar.jsx so you can easily find the files in editors such as VS Code (Ctrl + P). So don't put index.js inside component folders even though it makes importing paths shorter...
- For components include css modules in the same folder so you can easily copy paste the folder to any other location.
- For convenience files with React code use .jsx file extension. Files with vanilla js use .js.
- Try not to set any styles on html for accessibility reasons. Screen readers and assistive technology usually manipulate the root HTML element so we don't want to overwrite any of those settings. Same for any user agent resets, only reset when necessary.
- Try to use Semantic naming for Agility CMS modules and React components.
- Accessibility: don't use "display: none", "opacity: 0", or "visibility: hidden" for elements that are hidden but should be available for screen readers. These include but are not limited to: navigation dropdowns, toggleable dropdowns or accordions (such as faq sliders), or any element that should be visible to screen readers. Instead, use "position: absolute" and "left: -2147483647px;" **NOTE: offsetting absolutely to top will break safari's scroll so always offset left or right** to hide elements but leave them visible for screen readers. 


# UJET Website with Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
