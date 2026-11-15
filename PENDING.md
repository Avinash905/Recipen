# Pending work

## Password recovery and email delivery

Deferred by the project owner. Add a secure “Forgot password?” flow later, including expiring, single-use reset links, rate limits, safe responses that do not reveal whether an account exists, session invalidation after reset, and tests. Connect an email delivery service only when the owner is ready; the provider and sender domain have not been chosen. Use server-side secret storage for credentials. Email address verification also remains open.

## Sign in with Google

Deferred by the project owner. Add Google sign-in alongside the existing email and password option later. Set up a Google Cloud project and OAuth client, verify Google credentials on the backend, and handle existing-account linking safely so users retain their recipes and saved items. Do not automatically link accounts solely on an unverified email claim. Test sign-in, sign-out, disabled accounts, and local and deployed origins before release.

## Service and owner decisions

Contact delivery and its recipient have not been verified. Privacy and terms documents require owner-approved content and destinations. Checkout remains disabled until payment confirmation and fulfillment are designed and verified. Preparation/rest times and calorie serving basis require reliable recipe data. Previously shared active credentials must be rotated in the relevant services.

The owner prefers synthetic recipes locally. After deployment, test the live app and use its APIs to add, update or remove recipes to create a realistic, authentic catalog. The live recipe API did not respond to a read-only check on November 14, 2026; do not assume real recipes are missing or change live data based on the local fixtures.

## Remaining verification and rollout work

Account-switching safeguards still need a complete session review. A delayed refresh or sign-out response can change the browser cookie after another account signs in; delayed profile and other account updates can also affect a newer session. The browser cookie timing issue is not fixed by checking the in-memory access token. Three additional session timing hypotheses were not reproduced because an automatic safety review blocked those tests. Retest cache isolation and the session changes across accounts before release.

Login, refresh, sign-out and password-change requests now use the same browser coordination lock. A signed-in tab cannot refresh a different session's cookie, sign-out avoids clearing another session's cookie, and profile and favorite responses are checked against the initiating session. The expiring IndexedDB fallback was removed because a suspended request could outlive its lease. Browsers without Web Locks cannot sign in or refresh; the UI reports the limitation. Requests outside this client and clients running an older version are not coordinated by this lock. Cross-tab browser and suspended-tab checks remain open.

New sessions are bound to the account's security version. Session cookies now include a separate sign-out secret that stays stable across refreshes, and completed sign-out is ordered against password changes using a session revocation flag and account revision. The specific timing tests remain unverified because an automatic safety review blocked their reproduction.

This cookie-format change rejects old two-part and signed refresh cookies; existing users must sign in again. Older server versions do not understand the new format, so avoid mixed-version deployments and resolve in-flight old requests during a coordinated cutover. Legacy sessionless sign-out can revoke all sessions. The session protocol change and its timing guarantees still require independent security validation before deployment.

Access tokens no longer contain profile fields or favorites; those fields now arrive separately in account responses. Older client code expects those fields inside the token, so frontend and backend must be updated together and stale clients refreshed. Account data has a server-side revision so the client can ignore an older profile or favorite snapshot. An isolated client-state check passed; full browser verification of overlapping updates remains open.

Registration, refresh and authenticated writes have process-local limits. Sign-in also limits failures for a normalized email address to ten per minute. These limits reset on restart, are not shared across server instances, and IP-based limits depend on the actual proxy configuration. Account throttling can temporarily block a legitimate user if someone repeatedly attempts their address, and email forms treated as equivalent by the database may not all share a limit. Verify deployment topology, proxy settings and email normalization, and choose a suitable shared limit store before relying on these controls in production. Administrator second-factor sign-in remains open.

The general, saved and creator collections now use paginated endpoints. A local 1,200-recipe synthetic benchmark was run, but text search still scans matching records and has not been load-tested on production-sized data.

Recipe and story titles now update in the browser, and misleading homepage-only sharing URL and unrelated image tags were removed. Per-item social previews still need HTML generated for each public item that social crawlers can read; changing browser-side tags alone would not reliably provide those previews.

Recipe and story comments now have paginated endpoints for the current client. The legacy detail endpoints still return all comments by default for compatibility, and comments remain embedded in their parent records, so database document growth and write costs are not bounded by pagination.

Recipe cards request compact rating summaries, but ratings remain embedded in recipe records and the legacy catalog response still includes individual ratings for compatibility. Review long-term storage growth with production-sized data.

New sessions use hashed, rotating per-device tokens and a hashed sign-out secret. Browser authentication now requires Web Locks. Test browser support, deployed cookie settings and browser privacy modes before release. A security review is still needed.

The frontend build and lint pass. Cross-browser, physical-device, screen-reader, upload, network and production performance checks are not complete; only selected synthetic journeys and layouts were tested. Safari screen capture failed here and Firefox and Edge were unavailable. A production database email audit is required before introducing the case-insensitive unique index; see `server/local-test/README.md`.

Dependency updates include React Router 7, Vite 6 and bcrypt 6. The project now selects Node 26.13.1 through `.nvmrc`; clean installs, build, lint and selected synthetic tests passed on Node 26. Confirm the deployment runtime and repeat the wider regression checks before release. The machine's default Node installation is separately broken and was not changed. Dependency advisory results change over time and should be rechecked before deployment.

Chrome passed a basic local synthetic sign-in, reload and sign-out check on November 14, 2026. Safari remains untested because computer-use screen capture failed; Firefox and Edge were not installed, and Dia was not tested. Web Locks are required in a secure context; see https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API. This does not establish that the complete app works in every supporting browser.
