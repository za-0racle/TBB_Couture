# Admin workspace setup

The site now has a dedicated `/admin` workspace, an overview dashboard, a gallery manager, and a sale-item manager. It uses Supabase Auth, Postgres, and Storage through native browser APIs. There is no bundled admin password or fake local-only upload system.

## 1. Create and configure Supabase

1. Create a Supabase project you own.
2. Open the SQL Editor and run the complete `supabase/schema.sql` file.
3. In Authentication, create an admin user with an email and password. Confirm the user's email in the dashboard if needed. Do not add a public signup page; disable new user signups for this admin-only project.
4. Copy that user's UUID and run this SQL, replacing the placeholder:

```sql
insert into public.admin_users (user_id)
values ('REPLACE_WITH_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

The browser cannot grant admin membership. An ordinary authenticated user has no write permission. Both tables use row-level security; only published content records are readable by visitors. All content writes and storage mutations require membership in `admin_users`.

## 2. Connect local development

Copy `.env.example` to `.env.local`. Fill in your Supabase project URL and public publishable key from the project's Connect / API keys screen:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

Never put a service-role or secret key in a `VITE_` environment variable. These values are bundled into client code; the public key is intended for browser use with the provided RLS policies.

Restart `npm run dev`, then visit `/admin` and sign in. If the environment is not configured, the admin page explains the required setup and uploads remain unavailable.

## 3. Connect Vercel

Add the same two variables to the Vercel project's environment settings for Production and any Preview environments you want to use. Redeploy after setting or changing them. Vite reads these variables at build time.

`vercel.json` rewrites `/admin` and its child paths to the app entry so direct visits and refreshes work. Keep Vercel's build command as `npm run build` and output directory as `dist`.

## 4. Publish work and products

- Gallery works: title, category, image, image description, optional description, and draft/published visibility.
- Sale items: product name, readymade/material category, naira price, per-piece/per-yard unit, image, image description, optional details, and visibility.
- Images accept JPEG, PNG, and WebP up to 5 MB. Upload and save progress is shown; errors preserve the form for retry.
- Drafts do not appear in the public gallery or marketplace. Published entries appear when visitors load or refresh the storefront.
- Edit an item to replace its image or change visibility. Delete requires confirmation and removes its image when storage is reachable.
- Dashboard counts report content totals, not sales or revenue. Purchases remain WhatsApp inquiries; checkout, payments, stock tracking, and course administration are not included.

The media bucket is public so published images are fast and directly accessible. Draft records are private, but anyone with a draft image's exact URL can view its image. Do not upload confidential material. Image replacement and deletion try to remove old files; if cleanup fails, the workspace reports it so the owner can remove the unused file in Storage. Already-open storefronts and browser/CDN caches can retain old images temporarily.

Sessions use per-tab session storage and refresh access tokens when needed. Signing out clears the local session even if the network is unavailable. To reset an admin password, use the Supabase dashboard's account recovery options. Revoking a user from `admin_users` immediately blocks future content/storage writes via RLS.

## Verification before launch

1. Sign in with an authorized admin account. Confirm a non-admin Auth user cannot enter the workspace or write data directly.
2. Upload one draft gallery work and one draft product. Confirm they do not appear in a signed-out browser.
3. Publish both, then refresh the public site. Confirm the work appears in Gallery and the item appears under the correct marketplace filter with its saved price.
4. Edit metadata and replace an image. Refresh to confirm the change.
5. Unpublish and delete records; verify their public listings disappear. Verify storage cleanup or its reported error.
6. Test sign-out, invalid login, unsupported files, oversized uploads, network errors, mobile layouts, and direct navigation to `/admin` on Vercel.

The repository includes an automated validation test for content rules and HTML escaping. Live Auth, RLS, upload, and deployment verification requires your connected Supabase project; it cannot be completed with placeholder environment values.

Official references: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Auth API](https://supabase.github.io/auth/).
