# The Hjemmet Stack

Build a typesafe fullstack application from database to the frontend to ensure less bugs and faster iterations.

![The stack](static/Hjemmet%20stack.png)

## Introduction
The hjemmet stack is build upon three fundemental parts, User Experience, Typesafety and Customizability. 

## User Experience
As all good developers know, the most important part of web development is to deliver products to our users. User expreiences not only comes from the functionality of our web apps, but especially from the small details most don't notice. An example of this can be seen with optimistic load transitions, where the animation to a new page begins before that page is loaded, making the transition seamless. The UI is written using Skeleton UI and Tailwind for fast iterations. 

## Typesafety
Moving fast requires confidence and courage, which is only possible if we can trust the code we write. The Hjemmet stack enables end-to-end typesafety from the database to the client. If a variable is changed in the database the typescript compiler errors everywhere in the code where the change is not implemented. This is integrated using Prisma for typesafte between the database and the server. Where zod and superform is used for typesafety between the server and client. 

## Customizability
The hjemmet stack uses Lucia-auth for authentication as it allows for fine control over the authentication flow which is something that is lacking from other libraries like next-auth or backend as a service providers.

## Developing

Once you've created a project and installed dependencies with `pnpm install` start a development server:

```bash
pnpm run dev
```

## Hosting
Hosting is done automatically each time main branch is updated. This will trigger a rebuild and deploy the new feature within 30 seconds.  

