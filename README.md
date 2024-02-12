# 8TP4TP : By The People, For The People

Democratic social network platform.

## Features

- Light/dark mode toggle (Persisted with localstorage)
- Authentication handled with react-oauth/google.
- JWT token based auth with the use of localstorage for persisting credentials until JWT token is expired.
- Post statuses with photo. [hosted in cloudinary]
- Like / Unlike posts.
- Edit/Delete posts.
- Comment on posts.
- Separate page for own posts and public posts.
- Infinite scrolling on Global Feed page (as there can be huge number of post in news feed)

## Tech Stack

**Client:** Next.js ( App Router ), Redux Toolkit, Apollo Client, TailwindCSS, shadcn

**Server:** mongoDB, Express.js, GraphQL
