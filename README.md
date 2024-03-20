# Smoke Pal
Part of my Engineering thesis. This repo contains an internet application written in Next.js and Express. <br>
The app allows users to visualize data read by microcontrollers as well as save current smoking session and <br>
browse already finished ones.

## Usage
To get the fullest of the app you will need to either port source code for your setup or utilize my source and microcontrollers schematics <br>
Both are available at this [link](https://github.com/MRajczyk/SmokePalMicrocontrollers)

## Overview
This repo holds a fullstack Next.js app, a separate Express backend and also a docker compose file for Postgres DB configuration. <br>
Both subprojects have their own dependencies and have to be run separately explicitly, as I still did not include them in my compose file.

![image](https://github.com/MRajczyk/SmokePal/assets/103463343/6732ad61-f85d-4fbd-a4ce-0769148fc4a4)
![image](https://github.com/MRajczyk/SmokePal/assets/103463343/1e9c8156-39e2-4bd2-a944-cb2926f3c342)

## How to install and run project:
1. Clone the repo
2. Create **_.env_** file for the Next.js application *(folder 'app')* with the following variables (names should be self-explanatory, ig.)
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_HOST_IP=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_OPENWEATHER_API_KEY=
```
3. Create **_.env_** file for the Express backend *(folder 'backend')* with the following variables (names should be self-explanatory, ig.)
```
DATABASE_URL=
LOCAL_IP=
NEXTAUTH_SECRET=
```
4. Run the following commands both in app and backend directory:
```
npm install
npx prisma db push
```
5. Start the backend app
```
npm run start (or "npm run dev" to run in the dev mode)
```
6. Build Next.js app and run it
```
Prod build:
  npm run build
  npm run start
Dev mode:
  npm run build
```
