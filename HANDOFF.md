# StudyHub — Backend Handoff

Static frontend (HTML, CSS, vanilla JavaScript). No build step. Everything the backend needs to connect is listed here.

## 1. Run it
Open `index.html`, or `npx serve .`. Deploy to any static host. `vercel.json` enables clean URLs (`/login` serves `login.html`) and basic security headers.

## 2. Files
| File | Purpose |
|---|---|
| `index.html` | Marketing landing page |
| `login.html`, `signup.html` | Auth pages (real forms with `action` + `method`) |
| `css/styles.css` | Design tokens, components, responsive rules |
| `js/config.js` | **Only file the backend dev edits**: API base URL, endpoints, redirects |
| `js/api.js` | `fetch` wrapper: JSON, cookies, normalised errors |
| `js/auth.js` | Form validation, submit, error display, safe redirect |
| `js/nav.js` | Mobile menu and scroll-spy |

## 3. Connecting the API
Edit `js/config.js`:
- `API_BASE: null` = demo mode (forms validate, nothing is sent). This is the default.
- `API_BASE: ""` = same origin. `API_BASE: "https://api.example.com"` = separate origin.

If the API is on another origin: enable CORS for the site origin with `Access-Control-Allow-Credentials: true` (no wildcard origin) and allow the `Content-Type` and `Accept` headers.

## 4. API contract
All requests: `POST`, `Content-Type: application/json`, cookies included (`credentials: "include"`). Use an `HttpOnly; Secure; SameSite=Lax` session cookie. Do not return tokens for JavaScript to store.

### `POST /api/auth/login`
Request: `{ "email": "a@b.com", "password": "…", "next": "/courses/x" }` (`next` optional)
Success `200`: `{ "redirect": "/dashboard" }` (`redirect` optional; falls back to `next`, then `ROUTES.afterLogin`)

### `POST /api/auth/signup`
Request: `{ "full_name": "Ada Obi", "email": "a@b.com", "password": "…", "course": "modern-web-development", "source": "card" }` (`course`, `source` optional)
Success `200` or `201`: `{ "redirect": "/onboarding" }`

### Errors (any non-2xx)
```json
{ "error": { "code": "invalid_credentials", "message": "Email or password is incorrect.", "fields": { "password": "Incorrect password." } } }
```
`message` is shown in the form banner. `fields` (optional) maps a field name to an inline message. Suggested statuses: `400/422` validation, `401` bad credentials, `409` email already registered, `429` rate limited.

### Validation (repeat on the server; the client check is only for speed)
- `full_name`: at least 2 characters
- `email`: valid format, unique on signup
- `password`: signup needs 8+ characters with a letter and a number; login only needs a value
- `website`: honeypot field. If it is non-empty, treat the request as a bot and reject it (the frontend already drops it).

## 5. Routes the frontend links to
| Link | Goes to | Notes |
|---|---|---|
| Log In, "Continue Learning" | `login.html` (`?next=/dashboard`) | `next` must be a same-origin path |
| Get Started, Start Learning | `signup.html?source=…` | `source` = nav, hero, card, browse |
| Course card "Start Learning" | `signup.html?course=<slug>` | slugs below |
| After login / signup | `/dashboard`, `/onboarding` | **Not built**: backend/app pages |

Course slugs (`data-course-slug` on each card): `ui-ux-design-fundamentals`, `modern-web-development`, `digital-marketing-strategy`, `product-design-essentials`.
Category keys (`data-category`): `ui-ux-design`, `web-development`, `business`, `marketing`, `data-technology`.

## 6. Not built (needs backend or content)
- Course catalogue, course detail and learner dashboard pages
- Password reset, email verification, terms and privacy pages
- Real course, instructor and pricing data. Names and durations on the cards are sample content.

## 7. Navigation behaviour (QA reference)
- Desktop: links in the bar, "Log In" text link, "Get Started" button.
- Phone (820px and below): logo, round Log In icon, Get Started, hamburger. The hamburger opens Courses, Categories, How It Works and About.
- Menu: `aria-expanded` and `aria-label` update; closes on link tap, Escape (focus returns to the button), outside tap, or resize to desktop.
- Scroll-spy sets `aria-current="location"` on the link for the section in view.
- Skip link ("Skip to main content") is the first focusable element.

## 8. QA checklist
- Keyboard only: Tab through the nav, open and close the menu with Enter and Escape.
- 360, 390, 768, 1280 px: no horizontal scroll, header fits on one row.
- Forms: empty submit shows inline errors and focuses the first bad field; API error shows banner and field messages; double-click does not send twice (button disables).
- Redirect: `next` and `redirect` accept only paths starting with `/` and not `//`.
