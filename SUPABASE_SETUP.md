# Supabase Setup Guide — BookKar

## ✅ What's Already Done

### 1. MCP Config (Kiro)
File: `~/.kiro/settings/mcp.json`
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=fjwsafubenuwhurijvyz"
    }
  }
}
```

### 2. Project Files Created
| File | Purpose |
|------|---------|
| `.env.local` | Supabase credentials (currently placeholders) |
| `supabase/schema.sql` | Full DB schema with indexes + RLS policies |
| `supabase/seed.sql` | Demo data (Glow Salon, services, patients, appointments) |
| `src/lib/supabase/client.ts` | Browser-side Supabase client (`@supabase/ssr`) |
| `src/lib/supabase/server.ts` | Server-side Supabase client |
| `src/lib/supabase/middleware.ts` | Session refresh middleware |
| `src/middleware.ts` | Next.js middleware using Supabase session |
| `src/lib/db-hybrid.ts` | **Auto-switches** between JSON file ↔ Supabase |

### 3. API Routes Migrated
All API routes now use `db-hybrid.ts`:
- `POST /api/auth` — login, register, logout
- `GET/POST/PATCH /api/appointments`
- `GET/POST /api/patients`
- `GET/POST/DELETE /api/services`
- `POST /api/whatsapp/webhook`

### 4. Build Status
```
✓ TypeScript — 0 errors
✓ Next.js build — success
```

---

## 🔑 Next Step: Add Real Credentials

Go to your Supabase project → Settings → API, then copy these into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fjwsafubenuwhurijvyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # anon/public
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # service_role/secret
```

**The app auto-switches to Supabase the moment you add real keys.** No code changes needed.

---

## 🗄️ Step 2: Run Schema + Seed

In Supabase Dashboard → SQL Editor → New Query:

1. **Paste and run** `supabase/schema.sql`
2. **Paste and run** `supabase/seed.sql`

---

## 🧪 Verify Switch

With real keys in `.env.local`, restart dev server:
```bash
npm run dev:clean
```

Test:
1. Login with `demo@glowsalon.in` → should hit Supabase
2. Create a service → should persist to Supabase
3. Check Supabase Table Editor → data should appear

---

## 🛡️ Row Level Security (RLS)

Schema includes RLS policies. Every query filters by `business_id` via `current_setting('app.business_id')`.

To enforce this in API routes, add this before each Supabase query:
```ts
await supabase.rpc('set_config', { key: 'app.business_id', value: session.business_id });
```

(Or disable RLS during initial testing in Supabase Dashboard.)

---

## 📊 Architecture

```
API Route → db-hybrid.ts
    ├── Supabase env vars present? → db-supabase.ts → Supabase
    └── Missing/placeholder?      → db.ts → JSON file (data/db.json)
```

This lets you:
- **Develop locally** without Supabase (JSON file works offline)
- **Switch instantly** by adding real credentials
- **Migrate gradually** — test Supabase in parallel
