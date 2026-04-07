# TrivolutionSlots Leaderboard

This build is set up for Next.js on Vercel with Neon Postgres and Prisma, using **cron-job.org** instead of Vercel Cron.

## Required environment variables
- `ADMIN_PASSWORD`
- `CRON_SECRET`
- `DATABASE_URL`
- `ROOBET_API_KEY` optional
- `ROOBET_USER_ID` optional
- `NEXT_PUBLIC_APP_URL` optional

## Local setup
```bash
npm install
copy .env.example .env
npx prisma db push
npm run dev
```

## Vercel setup
1. Import the repo into Vercel.
2. Add all env vars from `.env.example`.
3. Redeploy.

## cron-job.org setup
Create a job that sends a `GET` request to:

```text
https://your-domain.com/api/cron
```

Add this request header:

```text
Authorization: Bearer YOUR_CRON_SECRET
```

Recommended interval:
- every 15 minutes

## Notes
- This project does **not** use Vercel Cron.
- Build runs `prisma db push` so Neon tables are created during deploy.
- Admin settings save to `LeaderboardSettings`.
- Prize save uses Prisma upsert for each rank.
- Manual sync is `/api/sync`.
- External cron sync is `/api/cron` and accepts `Authorization: Bearer <CRON_SECRET>`.
- `/api/cron/sync` redirects to `/api/cron` for backward compatibility.
