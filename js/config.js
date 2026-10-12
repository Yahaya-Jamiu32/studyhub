/* StudyHub runtime configuration. Backend developers: edit this file only.
 *
 * API_BASE
 *   null            -> DEMO MODE. Forms validate but nothing is sent (no backend connected).
 *   ""              -> same origin (frontend and API served from one domain), e.g. POST /api/auth/login
 *   "https://api.studyhub.com" -> separate API origin (needs CORS + credentials, see HANDOFF.md)
 */
window.STUDYHUB_CONFIG = {
  API_BASE: null,
  ENDPOINTS: { login: "/api/auth/login", signup: "/api/auth/signup" },
  // Where to send the user after a successful request (a "redirect" field in the API response wins).
  ROUTES: { afterLogin: "/dashboard", afterSignup: "/onboarding" }
};
