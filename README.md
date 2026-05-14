# Viph

Scent discovery widget SaaS for candle, soap, and fragrance stores.

Merchants embed one script tag. Shoppers take a 4-question quiz and get a personalised scent match.

## Structure

```
Viph/
├── apps/
│   ├── dashboard/     Next.js 14 merchant dashboard
│   └── widget/        Vanilla JS embeddable widget (Shadow DOM)
├── packages/
│   └── core/          Matching algorithm, copy generator, shared types
└── README.md
```

## Quick start

```bash
# Install all deps
npm install

# Push DB schema
npm run db:push

# Seed test merchant + products
npm run db:seed

# Start dashboard dev server
cd apps/dashboard && npm run dev

# Build widget
npm run widget:build
```

Dashboard runs at http://localhost:3000

**Test credentials**
- Email: `test@viph.co`
- Password: `password123`
- Store ID: `test-store-local`

## Widget test page

After building the widget, open `apps/widget/dist/test.html` in a browser.
The widget will call `http://localhost:3000` so keep the dashboard dev server running.

## Embed code

```html
<script
  src="https://viph.co/widget.js"
  data-store-id="YOUR_STORE_ID"
></script>
```

Optional attributes:
- `data-accent-color` — hex colour for the button and CTA (default: `#c8956c`)
- `data-position` — `bottom-right` | `bottom-left` | `inline` (default: `bottom-right`)
- `data-button-text` — overrides default button label
- `data-api-base` — override API base URL (for self-hosting)

## API routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/match` | POST | none | Run matching algorithm, return top product + copy |
| `/api/products` | GET | session / storeId | List products |
| `/api/products/tag` | PATCH | session | Bulk update product tags |
| `/api/import/shopify` | POST | session | Import via Shopify Storefront API |
| `/api/import/csv` | POST | session | Import via CSV upload |
| `/api/analytics/quiz-complete` | POST | none | Log quiz completion |
| `/api/merchant/settings` | GET/PATCH | session | Read/update merchant config |
| `/api/register` | POST | none | Create merchant account |

## Tech stack

- **Dashboard**: Next.js 14, App Router, Tailwind CSS, NextAuth, Prisma + SQLite
- **Widget**: Vanilla TypeScript, Shadow DOM, esbuild
- **Monorepo**: Turborepo + npm workspaces
- **Core**: Pure TypeScript, no runtime deps
