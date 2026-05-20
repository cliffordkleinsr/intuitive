# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Always use `bun` as the script runner — never `npx` or `npm run`.

```bash
bun run dev          # start dev server
bun run build        # production build (adapter-node)
bun run check        # svelte-check type checking (expect pre-existing errors in unrelated files)
bun run lint         # prettier + eslint
bun run format       # prettier write

bun run db:push      # push schema changes to DB (no migration files)
bun run db:pull      # introspect DB into schema
bun run db:studio    # open Drizzle Studio
```

Required environment variables: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ZEDIS_URI`.

## Architecture

### User roles and route groups

Two authenticated user types share the same `UsersTable` (`role` enum: `CLIENT` | `AGENT`):

- **CLIENT** — survey creators, access `/client-console/*`
- **AGENT** — survey respondents, access `/agent-console/*`

Route layout groups under `src/routes/`:
- `(frontend)` — public marketing pages + `(auth)` sign-in/register flows for both roles
- `(protected)` — auth-gated: `client-console/`, `agent-console/`, `anonymous/[surveyId]/`
- `api/` — internal REST endpoints
- `babana/` — PesaPal payment IPN callbacks

### Authentication

Custom session-based auth in `src/lib/server/auth.ts` using `@oslojs/crypto` (SHA-256 token hashing). Google OAuth via `arctic` in `src/lib/server/oauth.ts`. Sessions expire after 30 hours and renew at the 30-minute threshold. `hooks.server.ts` validates every request and populates `event.locals.user` / `event.locals.session`. Bot blocking runs before auth via `svelte-kit-bot-block`.

### Database

Drizzle ORM + `postgres.js` driver. Schema in `src/lib/server/db/schema.ts`, connection in `src/lib/server/db/index.ts` (`casing: 'snake_case'` — TypeScript camelCase maps to DB snake_case automatically). All large query helpers live in `src/lib/server/db/db_utils.ts`.

Key tables:
- `UsersTable` — unified user table for both roles
- `SurveyTable` — survey metadata (`consumer_id`, `status: Draft|Live|Closed`, `max_responses`, `survey_expires`)
- `surveyqnsTableV2` — questions with `questionT` (type enum)
- `QuestionOptions` — options for Single/Multiple/Ranking questions
- `QuestionBranching` — conditional skip logic between questions and options
- `response_table` — individual answers; has `updatedAt` timestamp (only date-filterable table)
- `user_analytics` — respondent demographic data (country, state, sector, education); **no timestamp column**
- `agentSurveysTable` — tracks agent assignment and completion per survey
- `progressTable` — stores current question index for in-progress agent sessions
- `userPackage` / `consumerPackage` — billing/subscription records
- `costTable` / `pricingTable` — plan definitions

### Plan gating

`src/routes/(protected)/client-console/+layout.server.ts` is loaded for every client console page and returns `data.features` (`{ plan: 'Free'|'Premium'|'Enterprise', max_responses, demographics, branding }`). Feature visibility in templates is driven by `data.features.plan` checks, e.g. `class={data.features.plan === 'Free' ? 'hidden' : ''}`.

### Survey lifecycle

1. **Create** — `client-console/surveys/create/` — superforms + zod schema
2. **Edit** — `client-console/surveys/edit/[surveyid]/[questionid]/` — add/reorder questions, options, branching rules
3. **Live** — status set to `Live`; agents see it in `agent-console/surveys/take/`
4. **Statistics** — `client-console/statistics/[surveyid]/` — analytics dashboard with geo map, sector/education charts, per-question breakdowns. Date filtering via `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` URL params (filters `response_table.updatedAt` only).

Anonymous (non-agent) respondents use the `anonymous/[surveyId]/` flow.

### UI layer

shadcn-svelte components (bits-ui primitives) in `src/lib/components/ui/`. Custom application-specific blocks in `src/lib/custom/blocks/` — question composition widgets, wordcloud, XY flow diagrams, geo maps.

Forms use `sveltekit-superforms` with `zod` adapters. Server-side flash messages via `sveltekit-flash-message`; client-side toasts via `svelte-sonner`.

Charts use `layerchart` (wraps d3) for geo maps, bar charts, pie charts, and the statistics dashboard.

The entire app is written in **Svelte 5 runes** (`$state`, `$derived`, `$effect`, `$props`). Do not use legacy Svelte 4 store syntax (`writable`, `$store`) in new code.

### Rate limiting & caching

Two Redis clients:
- `src/lib/server/redis.ts` — Upstash (REST, serverless-safe) via `@upstash/ratelimit` for survey create/delete actions
- `src/lib/server/zedis.ts` — ioredis (`ZEDIS_URI`) for other server-side caching needs

### Date formatter

A shared `DateFormatter` instance `df` is exported from `src/lib/custom/functions/helpers.ts` (`'en-US', { dateStyle: 'long' }`). Use it with `@internationalized/date` `CalendarDate` / `DateValue` types when formatting dates in components.
