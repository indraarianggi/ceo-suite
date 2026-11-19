# CEO SUITE

Workspace booking website: search and book private offices, coworking spaces, meeting rooms and event spaces.

There is no backend yet. Spaces, accounts and bookings are mocked behind small functions in `src/lib/`, so every page and flow works out of the box and a real API can replace those functions later.

## Tech stack

| Area         | Technology                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Framework    | [Next.js](https://nextjs.org) 16 (App Router, Cache Components with Partial Prerendering, Server Actions, Turbopack)        |
| UI library   | [React](https://react.dev) 19                                                                                               |
| Language     | [TypeScript](https://www.typescriptlang.org) 5 (strict)                                                                     |
| Styling      | [Tailwind CSS](https://tailwindcss.com) 4, design tokens from Figma in `src/app/globals.css`, `tw-animate-css`              |
| Components   | [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), [Lucide](https://lucide.dev) icons                    |
| Forms        | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) 4 (schemas shared by the client and Server Actions) |
| Dates        | [date-fns](https://date-fns.org) 4, [React DayPicker](https://daypicker.dev) 10                                             |
| Motion       | [Motion](https://motion.dev) (`motion/react`), reduced motion respected                                                     |
| Font         | Plus Jakarta Sans via `next/font`                                                                                           |
| Testing      | Node's built-in test runner (`node --test`) for the domain logic in `src/lib/`                                              |
| Code quality | ESLint 9 (`eslint-config-next`), Prettier 3 with `prettier-plugin-tailwindcss`                                              |
| Tooling      | pnpm 12, Node.js 24 (20.9+ supported)                                                                                       |

## Setup

### Prerequisites

- **Node.js 20.9 or newer** (developed on Node.js 24).
- **pnpm 12.** The exact version is pinned in `package.json` (`packageManager`). The easiest way to get it is Corepack, which ships with Node.js:

  ```bash
  corepack enable
  ```

### Install and run

```bash
git clone git@github.com:indraarianggi/ceo-suite.git
cd ceo-suite
pnpm install
pnpm dev        # http://localhost:3000 (Next.js picks the next free port, e.g. 3001, if 3000 is busy)
```

### Environment (optional)

Locally nothing is required. For a deployed site, set the public URL so canonical links, Open Graph images, the sitemap and structured data point to the right domain. Create `.env.local` (or set it in your host's dashboard):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

It is read at build time, so rebuild (or redeploy) after changing it.

### Production build

```bash
pnpm build
pnpm start      # serves the build on http://localhost:3000
```

Sign-in uses a `Secure` cookie in production builds, so use https, or Chrome/Firefox on `localhost`.

### Before you commit

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm format:check && pnpm build
```

## Scripts

| Script              | Purpose                                |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start the dev server                   |
| `pnpm build`        | Production build                       |
| `pnpm start`        | Serve the production build             |
| `pnpm lint`         | ESLint                                 |
| `pnpm typecheck`    | Generate route types and run `tsc`     |
| `pnpm test`         | Unit tests (`node --test`)             |
| `pnpm format`       | Format with Prettier (+ class sorting) |
| `pnpm format:check` | Check formatting                       |

## Pages

All pages are built from the Figma design at 1920px and adapt down to 320px (mobile and tablet layouts are designed in code).

| Page             | Path                                      | What it does                                                                                                                                                                                                                |
| ---------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing          | `/`                                       | Hero with image slider and space search, Browse Spaces, Recommended For You, Why CEO SUITE, Promotions, Best Deals, Meeting Room Package, Corporate Partners, trusted-by logo marquee, News, FAQ, app download, newsletter. |
| Space listing    | `/spaces`                                 | All spaces with type filters, a map and "See More" paging.                                                                                                                                                                  |
| Category listing | `/spaces?type=meeting-room` (and others)  | One space type with its own hero and intro: private offices, co-working, meeting rooms, event spaces.                                                                                                                       |
| Search results   | `/spaces?city=Jakarta&from=…&to=…&type=…` | Results for the hero search (city, region, dates, types), with an empty state when nothing matches.                                                                                                                         |
| Space detail     | `/spaces/[slug]`                          | Photo gallery with lightbox, prices, details, add-ons, location map, booking card (date, time, live total), similar spaces.                                                                                                 |
| Booking          | `/booking?space=…&from=…&to=…`            | Booking details, add-ons, vouchers, terms and confirmation; guests can book with name, email, phone and an email code.                                                                                                      |
| My Booking       | `/my-booking`                             | Signed-in users' bookings in **Active** and **History** tabs (signed-out visitors are sent to sign in and back).                                                                                                            |
| Booking details  | `/my-booking/[reference]`                 | One booking: overview, add-ons, payment and price summary.                                                                                                                                                                  |
| Sign in          | `/login`                                  | Email and password, remember me, return to the page you came from.                                                                                                                                                          |
| Sign up          | `/sign-up`                                | Registration with password rules, optional identity step and email verification.                                                                                                                                            |
| Forgot password  | `/forgot-password`                        | Email, one-time code, new password, success.                                                                                                                                                                                |

Also generated: `sitemap.xml`, `robots.txt`, favicon and Apple touch icon, and structured data (Organization and LocalBusiness on the landing page, Product and BreadcrumbList on space pages, ItemList on listings).

Not built yet: `/promotions`, `/news`, `/partners` and `/contact`. Some links on the landing page still point to them and show the 404 page.

## Try the booking flow

Booking is mocked too (`src/lib/bookings.ts`, `src/lib/booking-actions.ts`). Open a space (for example `/spaces/axa-tower-meeting-room-a`), pick a date and time, and press **Book**. That lands on `/booking?space=…&from=…&to=…`, which you can also type by hand (`yyyy-MM-dd` dates; `start`/`end` as `HH:mm` on the 30-minute grid, only for a single day).

- **Signed in:** details, "Are your booking details correct?", terms, confirmed.
- **Not signed in:** the same, plus **Book as Guest** (name, email, phone) and an email code. Any 6 digits work except `000000`.
- **Add-ons:** price x quantity; per-pax items can't exceed the room's capacity.
- **Vouchers:** `15DISCOUNT`, `MEETING15`, `BOARDROOM15` or `WELCOME15`. Each is 15% off, capped at Rp100,000, and only for meeting rooms.
- **Try a failure:** type `[fail]` in **Additional Request**; the booking is rejected as unavailable.
- **Bad links:** past or malformed dates return you to the space page; an unknown space shows the 404 page.

The URL is never trusted for prices: the Server Action re-validates the selection and recomputes the total with the same `buildQuote()` the order summary uses.

## Try My Booking

My Booking (`/my-booking`) needs a signed-in user; signed-out visitors are sent to `/login` and come back afterwards.

- Sign in as `janedoe@gmail.com` (any password) to see demo bookings: two **Active** (one green **Success**, one red **Expired by Midtrans**) and two in **History**. Other accounts start empty, which shows the empty states.
- Book a space while signed in (see above): **View Booking** on the confirmation page lists it as Active, and each card opens its details page (`/my-booking/CS-XXXXXXXX`).
- Bookings made in your browser live in an httpOnly cookie (the newest few that fit in 4 KB), so they survive restarts but not another browser. A real API replaces the store functions in `src/lib/bookings.ts`.
- **Active** means the booking has not ended yet; **History** means it has. The demo bookings' dates are relative to today, so both tabs stay populated.
- Booking Details shows what the customer confirmed: the Final Price always equals the checkout total (PPN is shown as included, Overtime and Deposit are Rp0).

## Try the auth flows

Sign in, sign up (with email verification) and password reset all work out of the box. There is no backend and no real email: everything is mocked in `src/lib/auth.ts`, so you can try every screen and error state yourself. The guide below is the same on `pnpm dev`, on a production build, and on a deployed demo; just open the same paths on your own domain.

### 30-second tour

1. Open `/login`.
2. Enter email `janedoe@gmail.com` and **any** password, then click **Sign In**.
3. You land on the home page, and the header now shows your avatar and name (**Jane Doe**). Open the menu next to your name and click **Logout** to sign out.

### Where things are

| Page            | Path               | How to reach it                                            |
| --------------- | ------------------ | ---------------------------------------------------------- |
| Sign in         | `/login`           | Header **Sign In**, or **Sign Up Here** ↔ **Sign In Here** |
| Sign up         | `/sign-up`         | Header **Sign Up**, or **Sign Up Here** on the login page  |
| Forgot password | `/forgot-password` | **Forgot Password** link on the login page                 |

On screens narrower than 1280px the header collapses into a menu button; Sign In, Sign Up and Logout are at the bottom of that menu.

### Test data

Use these values to reach every success and error state.

| What you want to see             | Do this                                       | Result                                                                  |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| Successful sign in               | Any valid email + any password                | Redirected home, header shows your name                                 |
| Failed sign in                   | Email `wrong@example.com` + any password      | "Incorrect email or password."                                          |
| Failed sign up                   | Email `taken@example.com` on the sign-up form | "An account with this email already exists. Try signing in instead."    |
| Accepted verification / OTP code | Any 6 digits except `000000`, e.g. `123456`   | Moves to the next step                                                  |
| Rejected verification / OTP code | `000000`                                      | "That code is incorrect. Please try again."                             |
| Name shown in the header         | `janedoe@gmail.com` shows **Jane Doe**        | Other emails derive a name, e.g. `jane.doe@acme.com` shows **Jane Doe** |

Every request waits about 0.6 seconds to mimic a real network.

### Sign up and verify your email

1. Go to `/sign-up` and fill in the form.
   - **Phone number:** 8 to 15 digits, optional leading `+`; spaces and dashes are fine.
   - **Password:** at least 8 characters, at least 1 number, and both upper and lower case. The checklist under the field turns green as you meet each rule.
2. Click **Sign Up**. A **Complete your identity** dialog opens.
   - Pick a **Date of Birth** with the calendar (use the month and year dropdowns to jump quickly) and enter a **Company Name**, then click **Save my Data** (it stays disabled until both are filled in).
   - Or click **Skip for Now**.
3. On **Email Verification**, type any 6-digit code (not `000000`) and click **Verify**. You can paste the code, and the boxes fill automatically.
   - The countdown starts at `01:59`. When it ends, **Resend Code** appears.
4. You are sent to `/login`.

> Sign-up does not save an account (there is no database), so after verifying you can sign in with **any** email and password.

### Sign in and stay signed in

- **Remember me unchecked:** the session lasts until you close the browser.
- **Remember me checked:** the session lasts 30 days.
- After signing in you land on the home page and the header shows your avatar, name and a menu with your email and **Logout**.
- To reset the demo, click **Logout** (or delete the `ceo_suite_session` cookie in your browser's dev tools).

### Reset a forgotten password

1. On `/login`, click **Forgot Password** (or open `/forgot-password`).
2. Enter any valid email and click **Reset Password**. (**Back to Login** returns you to sign in.)
3. On **OTP Verification**, enter any 6-digit code except `000000` and click **Verify**.
4. On **Reset your Password**, enter a new password (same rules as sign-up) and retype it. **Password is match** turns green when both fields agree. Click **Save**.
5. A success message appears. Click **Go to Login** and sign in with any password.

### Good to know

- **Nothing is stored.** No accounts, passwords or codes are saved anywhere. The only thing kept is the session cookie.
- **Leaving a page resets it.** If you navigate away from a sign-in, sign-up or reset screen and come back, it starts fresh (so a typed password is never left behind). Refreshing in the middle of a multi-step flow also starts it over.
- **Production builds need https for the session cookie.** In `pnpm build && pnpm start` the cookie is marked `Secure`, so use https (or Chrome/Firefox on `localhost`). `pnpm dev` works everywhere.
- **The session cookie is unsigned.** That is fine for a mock, but see below before reusing it.

### For developers: swapping in a real backend

The UI only talks to a few small functions, so a real API replaces them without touching any screens.

| Concern                                                                                                                                       | File                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Mock API (`signIn`, `signUp`, `verifyCode`, `resendCode`, `requestPasswordReset`, `resetPassword`, `saveIdentity`) and the magic values above | `src/lib/auth.ts`                                                                      |
| Server actions `loginAction` and `logoutAction`                                                                                               | `src/lib/auth-actions.ts`                                                              |
| Session cookie (read, create, destroy)                                                                                                        | `src/lib/session.ts`                                                                   |
| Form schemas and password rules (zod)                                                                                                         | `src/lib/validation.ts`                                                                |
| Auth screens                                                                                                                                  | `src/components/sections/auth/`                                                        |
| Logged-in header and menus                                                                                                                    | `src/components/layout/` (`header-account.tsx`, `user-menu.tsx`, `mobile-account.tsx`) |

- Replace the functions in `src/lib/auth.ts` with real API calls. Keep their return shapes and the screens keep working.
- Replace `src/lib/session.ts` with a signed or encrypted session (for example iron-session) before going live; the current cookie holds the display name and email in plain text.
- The header reads the session behind `<Suspense>`, so the rest of every page stays in the static shell. Keep session reads in that slot.
- `pnpm test` covers the schemas, password rules, mock API and session helpers.
