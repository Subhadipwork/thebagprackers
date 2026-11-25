# The Backpackers

**Wander More, Worry Less.**

Website for The Backpackers, a Kolkata-based travel company for mountain, hill and nature trips to Meghalaya, Arunachal Pradesh, Kashmir and beyond. Group tours and customized trips.

The brand and content brief is in [`docs/the-backpackers-website-context.md`](docs/the-backpackers-website-context.md).

## Tech

- [Next.js](https://nextjs.org/) 16 (App Router, static export) · React 19 · TypeScript
- Tailwind CSS 3
- [motion](https://motion.dev/) animations, [lucide-react](https://lucide.dev/) icons
- UI pieces from [Magic UI](https://magicui.design/) and [Skiper UI](https://skiper-ui.com/) (Skiper UI free components require attribution, shown in the footer)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # static site in ./out
```

## Editing content

Contact details, destinations, tour types, "why us" points and gallery photos live in [`constants/site.ts`](constants/site.ts). Social links there are still placeholders.

Destination and gallery photos are illustrative images from [Unsplash](https://unsplash.com/) and load from Unsplash's CDN. Replace them with photos from the company's own trips when available.
