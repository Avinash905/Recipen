# Recipen current UI and UX review

13 November 2026. This review covers the current **local, uncommitted** checkout, not the deployed site. It combines a fresh browser walkthrough at desktop and 390 px with source inspection and the earlier real-catalog preview. The local browser used synthetic account and content data. No live forms or destructive actions were submitted during this review.

**Verdict:** The recipe discovery and reading screens have a clearer visual direction than before, but the experience is not yet consistently finished. Contact information and recovery are the most consequential user-facing gaps. Mobile navigation, creator empty states, editor resilience, and admin usability need another pass. Treat the list below as the issues identified in this review, not proof that every possible defect has been found.

**Evidence:** Observed means seen in the current local browser; Code means found in the current source and not necessarily reproduced live. Prior preview means observed in the earlier read-only review of real catalog content. P1 affects a key journey, trust, or accessibility; P2 creates meaningful friction or inconsistency; P3 is an enhancement. Severity reflects UX impact and is not a formal security rating.

## Highest priority

1. **P1 · Observed and code · Contact details are unverified.** The contact screen displays an example-looking email, phone number and street address, plus a promise to respond within 24 hours; their validity was not established. **Fix:** Replace them with owner-verified contact details and a realistic response commitment, or remove them. (`client/src/pages/contact/Contact.jsx:43`)
2. **P1 · Code · Contact submission has no managed feedback.** The form posts directly to Formspree, with no in-app confirmation, retry, or preservation guarantee, and the actual delivery configuration was not tested. **Fix:** Verify the recipient and service, then show sending, success and retry states without losing the message. (`client/src/pages/contact/Contact.jsx:108`)
3. **P1 · Observed and code · Mobile navigation is not keyboard-complete.** Escape left the drawer open, focus stayed on the background trigger, and there is no visible focus trap or return-to-trigger behavior. **Fix:** Use an accessible drawer that supports Escape, manages focus, and prevents background interaction. (`client/src/components/header/Menu.jsx:11`)
4. **P1 · Code · Share is a click-only icon.** The recipe share trigger is an SVG without a button role, accessible label, keyboard activation, or a copy-link alternative. **Fix:** Use a labeled button and an accessible share menu with Copy link. (`client/src/components/shareButton/ShareButton.jsx:19`)
5. **P1 · Observed · Admin actions are hard to reach on phones.** At 390 px, the recipe table initially exposed only the title; the delete action required horizontal scrolling past several columns. **Fix:** Use compact mobile rows or a details/action menu while keeping the desktop table. (`client/src/pages/dashboard/DashboardRecipes.jsx`)
6. **P1 · Observed and code · The 404 explanation is embedded in an animation.** The accessibility tree exposed only an image and “Back to Home,” with no actual page-not-found heading. **Fix:** Add a real heading and explanation, treating the animation as decorative. (`client/src/pages/message/Error.jsx:4`)
7. **P1 · Code · Creator libraries can fail on missing author records.** Both “My Recipes” and “My Blogs” access `obj.author._id` without checking whether the author exists. **Fix:** Use safe author handling and a clear error or empty state for incomplete records. (`client/src/pages/recipe/MyRecipes.jsx:12`, `client/src/pages/blogs/MyBlogs.jsx:12`)
8. **P1 · Code · Unsaved creator work has no recovery.** Recipe and blog forms keep drafts in component state without navigation protection or draft recovery. **Fix:** Warn before leaving a changed form and offer local draft recovery. (`client/src/pages/recipe/AddRecipe.jsx:14`, `client/src/pages/blogs/AddBlog.jsx:14`)
9. **P1 · Code · Account email changes lack confirmation.** Profile lets a signed-in account replace its email without verification of the new address; a mistaken address can leave the account hard to recover. **Fix:** Verify ownership of a new email before making it the account address. (`server/controllers/userController.js:19`)
10. **P1 · Code · Recovery and email verification remain unavailable.** A user who forgets a Recipen password has no self-service recovery, and registration does not verify the email. **Fix:** Implement the deferred, verified email flow when the owner selects an email service. (`PENDING.md`)

## Navigation and discovery

11. **P2 · Observed · Search placeholder is clipped on a phone.** The homepage input cannot show the full “recipes or ingredients” prompt at 390 px. **Fix:** Shorten the visible prompt or stack the search button at narrow widths. (`client/src/components/hero/Hero.jsx`)
12. **P2 · Prior preview · The hero image is generic.** The large breakfast photo is not linked to a recipe in the catalog. **Fix:** Feature a real recipe with a direct link, or reduce the decorative image. (`client/src/components/hero/Hero.jsx`)
13. **P2 · Code · Search only matches title and ingredient text.** Users cannot search the description or author, and there are no supported filters. **Fix:** Make the current scope explicit and add filters only when the necessary data is reliable. (`client/src/components/cards/AllCards.jsx`)
14. **P2 · Code · Search position is lost when returning.** The query is preserved on some detail links, but the global scroll-to-top handler resets position on route changes. **Fix:** Restore the previous list position when returning from a detail page. (`client/src/components/scrollToTop/ScrollToTop.jsx:8`)
15. **P2 · Code · My Recipes and My Blogs do not show load failures.** A failed catalog request can appear as an empty collection. **Fix:** Add a distinct error message and retry action. (`client/src/pages/recipe/MyRecipes.jsx:8`, `client/src/pages/blogs/MyBlogs.jsx:8`)
16. **P2 · Observed · Creator empty states are misleading.** “No recipes found” and “Check back soon” do not tell an author how to add their first recipe. **Fix:** Use “You have not created a recipe yet” with an Add recipe action, and do the same for stories. (`client/src/pages/recipe/MyRecipes.jsx:19`)
17. **P2 · Code · Creator libraries have no prominent Create action.** Adding content depends on finding the account menu. **Fix:** Put an Add recipe or Write a story action beside the library heading. (`client/src/pages/blogs/MyBlogs.jsx:19`)
18. **P2 · Code · Account and navigation controls compete in the mobile header.** The avatar and menu are separate small icons and the drawer lacks a direct visible search entry. **Fix:** Improve spacing and make the most-used discovery action obvious on small screens. (`client/src/components/header/Header.jsx`)
19. **P2 · Code · Some navigation links wrap buttons.** The sign-in link contains a button in both desktop and mobile navigation, producing nested interactive controls. **Fix:** Style a single link as the action. (`client/src/components/header/Header.jsx`, `client/src/components/header/Menu.jsx`)
20. **P2 · Code · The mobile drawer uses a fixed 300 px width.** It leaves little room on narrow displays and does not adapt to smaller viewports. **Fix:** Cap the drawer width to the available viewport. (`client/src/components/header/Menu.jsx:15`)

## Recipe reading and cooking

21. **P2 · Prior preview · Cook time is not total preparation time.** The real Masala Dosa instructions include soaking and fermentation beyond the displayed 45-minute cook time. **Fix:** Keep the Cook time label and add separate prep/rest/total fields when the data is available. (`client/src/pages/recipe/SingleRecipe.jsx:249`)
22. **P2 · Prior preview and code · Calories have no serving basis.** A value such as 540.7 cal does not say whether it applies to a serving or the whole recipe. **Fix:** Store and display the serving or batch basis, or omit the value until known. (`client/src/pages/recipe/SingleRecipe.jsx:250`)
23. **P2 · Code · Checklist progress disappears after a reload.** Ingredient and step checkboxes are uncontrolled and have no saved progress. **Fix:** Preserve per-recipe progress locally and provide a reset action. (`client/src/pages/recipe/SingleRecipe.jsx:269`)
24. **P2 · Code · A prior rating is not shown to its author.** The rating control disappears when the current user has rated, without showing “Your rating.” **Fix:** Display the user’s rating and explain whether it can be changed. (`client/src/pages/recipe/SingleRecipe.jsx:294`)
25. **P2 · Code · Comment forms ask for name and email that are not submitted.** Both fields are required by the form even though the request sends only the comment and uses account identity. **Fix:** Show the signed-in identity and ask only for the comment. (`client/src/pages/recipe/SingleRecipe.jsx:103`, `client/src/pages/recipe/SingleRecipe.jsx:319`)
26. **P2 · Code · Guests can type a comment before learning they must sign in.** A redirect occurs only on submission, and the typed comment is not retained. **Fix:** Show the sign-in requirement before editing and preserve a draft through sign-in. (`client/src/pages/recipe/SingleRecipe.jsx:95`)
27. **P2 · Code · Detail load errors and missing records look the same.** A temporary network failure is presented as “could not find or load” with no retry. **Fix:** Distinguish not-found from a failed request and offer retry. (`client/src/pages/recipe/SingleRecipe.jsx:175`)
28. **P2 · Code · Repeated recipe links add extra keyboard stops.** Each card exposes separate image, title, and View links to the same destination. **Fix:** Keep the image and title usable while avoiding an unnecessary duplicate action. (`client/src/components/cards/SingleCard.jsx:44`)

## Creator forms and account screens

29. **P2 · Observed and code · The required image picker appears after the publish button on mobile.** A creator can reach Add recipe before encountering the required image. **Fix:** Place the image field before the final submit action and indicate that it is required. (`client/src/pages/recipe/AddRecipe.jsx:353`)
30. **P2 · Code · Ingredient and step rows cannot be edited or reordered.** Users can add or remove a row but must delete and re-enter it to correct or move it. **Fix:** Provide editable rows and accessible move controls. (`client/src/pages/recipe/EditRecipe.jsx:280`)
31. **P2 · Code · Missing image and empty ingredient errors are transient toasts.** The message is not anchored to the field that needs attention. **Fix:** Show inline field errors and move focus to the first problem. (`client/src/pages/recipe/AddRecipe.jsx:72`)
32. **P2 · Code · Upload progress is not clearly named.** The progress indicator does not identify which image is uploading, and an existing image can make replacement state unclear. **Fix:** Announce upload progress and show explicit success or failure beside the picker. (`client/src/pages/recipe/AddRecipe.jsx:366`)
33. **P2 · Code · Form input error descriptions are always referenced.** Shared inputs assign `aria-describedby` even when no error message exists, while validation messages are hidden until a custom focus state changes. **Fix:** Associate help and errors only when present and announce errors accessibly. (`client/src/components/input/Input.jsx`)
34. **P2 · Observed · Profile mixes password change with basic details.** The optional new-password input appears in the same form as name and email, and the current-password field appears only after typing a new one. **Fix:** Separate password changes into a clearly labeled section or action. (`client/src/pages/profile/Profile.jsx:140`)
35. **P2 · Code · Profile upload cannot be cleared explicitly.** The server uses `image || existing`, so the user has no clear way to remove a profile picture. **Fix:** Add an explicit Remove photo action with a clear server representation. (`server/controllers/userController.js:47`)
36. **P2 · Code · Edit screens have no route-specific document titles.** The add screens set titles, while edit screens can retain a previous page title. **Fix:** Set “Edit recipe” and “Edit story” titles. (`client/src/pages/recipe/EditRecipe.jsx`, `client/src/pages/blogs/EditBlog.jsx`)
37. **P2 · Code · No indication of unsaved changes exists after editing.** It is difficult to tell whether displayed changes have been saved or whether a background update changed the original. **Fix:** Show a simple unsaved indicator and confirmed save state. (`client/src/pages/blogs/EditBlog.jsx`)

## Visual consistency and content

38. **P2 · Observed · The contact page still uses the earlier visual language.** Its large yellow panel, type, spacing and form treatment differ from the cookbook-style recipe and account screens. **Fix:** Restyle it using the same surfaces, typography and action hierarchy after confirming its content. (`client/src/pages/contact/Contact.jsx`)
39. **P2 · Code · The header and footer retain bright amber accents and animations.** They feel visually separate from the new neutral content surfaces. **Fix:** Align them with the chosen palette and reduce decorative motion. (`client/src/components/footer/Footer.jsx`, `client/src/components/header/Header.jsx`)
40. **P2 · Code · The footer lacks privacy and terms destinations.** These were removed rather than linked to verified documents. **Fix:** Publish owner-approved policies and add working links when they exist. (`client/src/components/footer/Footer.jsx`)
41. **P2 · Code · Story previews strip a few Markdown characters only.** Complex Markdown links or formatting can produce awkward excerpts. **Fix:** Generate a plain-text preview from parsed content or store a short summary. (`client/src/components/cards/SingleCard.jsx`)
42. **P2 · Code · Broken or absent images do not explain the problem consistently.** Cards and details use different fallback wording and image behavior. **Fix:** Standardize a neutral fallback and meaningful text for missing media. (`client/src/components/cards/SingleCard.jsx:45`)
43. **P2 · Code · Icons and action styles remain mixed.** Hearts, sharing, admin actions and primary buttons use different visual treatments across screens. **Fix:** Define a small consistent set of button, icon and focus styles. (`client/src/components/shareButton/ShareButton.jsx`, `client/src/components/button/Button.jsx`)
44. **P2 · Code · Reduced-motion support is incomplete.** Loading spinners honor reduced motion, but other Framer Motion interactions and animations remain. **Fix:** Respect reduced-motion settings across menus, cards and decorative states. (`client/src/components/footer/Footer.jsx`)
45. **P2 · Code · Checkout result pages rely on a shared animation message.** The success page is not proof of a confirmed payment, and new checkout is currently paused. **Fix:** Keep checkout paused until server-confirmed payment status is available and present a clear text result. (`client/src/pages/message/CheckoutSuccess.jsx`)

## Admin and operational usability

46. **P2 · Observed · The admin rail consumes a large share of a phone screen.** Its icons have accessible names, but no visible text or tooltips in the collapsed state. **Fix:** Use a compact mobile navigation pattern and add tooltips for pointer users. (`client/src/components/dashboard/Sidebar.jsx`)
47. **P2 · Code · Export is offered for all grids, including user information.** The review did not verify export permissions or intended operational use. **Fix:** Remove it where unnecessary or restrict and audit it explicitly. (`client/src/components/dashboard/Table.jsx:9`)
48. **P2 · Code · The dashboard root has no index route.** Opening `/dashboard` directly can show the shell without a selected view. **Fix:** Redirect the index to Users or a useful overview. (`client/src/App.jsx`)
49. **P2 · Code · Admin status buttons describe the action more than the current state.** A row with an Enable button implies the account is disabled, but the state is not separately labeled. **Fix:** Show an explicit Active or Disabled badge alongside the action. (`client/src/pages/dashboard/Users.jsx`)
50. **P2 · Code · Admin grids show fetched catalogs without pagination from the server.** As data grows, scanning and loading will become slower. **Fix:** Add paginated, searchable server endpoints and preserve the current table state. (`client/src/features/recipe/recipeApiSlice.js`)

## What works well in the current pass

- The homepage has a clear search-first message, and recipe and story cards use consistent crops and useful titles.
- Search results and return links preserve the query in the reviewed paths.
- Recipe details have readable ingredients and method checklists, plus quick section links.
- Saved recipes have an understandable empty state and a Browse recipes action.
- Sign-in, profile, creator forms and dashboard pages have clearer headings and a more consistent visual direction than the original audit.
- Admin delete and account-status actions use named confirmation dialogs; earlier local tests covered success, cancellation and a visible failure state.

## Coverage and limits

This pass inspected the local homepage, contact, sign-up, profile, recipe creation, creator library, admin recipe grid and 404 in the browser, plus current source for recipes, stories, saved collections and related workflows. Prior local walkthroughs covered recipe search, saved recipes, story reading, sign-in, profile saving, creator edits, and admin actions. Earlier read-only review used real catalog display fields. No fresh comprehensive retest of every feature, payment, contact delivery, upload service, physical device, assistive technology, or production environment was performed in this pass. Safari control previously failed; Firefox and Edge remain unverified. Measurements and screenshots do not replace full keyboard, screen-reader, color-contrast or performance testing.

## Follow-up implementation, 13 November 2026

The following changes are local and have not been deployed:

- Removed unverified contact details and response-time promise; added sending, success and failure states to the existing configured form. Actual delivery and recipient remain unverified.
- Replaced the mobile navigation with a focus-managed drawer, made the share control keyboard accessible, added copy link, and replaced the animation-only 404 with text.
- Added phone-friendly admin cards, visible account status, a dashboard index redirect, and removed grid export.
- Improved creator-library empty and error states, author null handling, edit-page titles, image-picker order, and image upload progress labels.
- Shortened the home search placeholder, added local recipe checklist progress and reset, displayed the existing user's rating, removed unused comment fields, added guest sign-in prompts, and added detail retry actions.
- Stopped displaying calories with an unknown serving basis. Updated shared input error associations.

Browser checks covered mobile drawer Escape and focus return, checklist persistence after reload, share menu opening, mobile recipe and user admin cards, and the 404 heading. The production build and whitespace check passed. Contact delivery, all editor changes, cross-browser behavior, and full regression testing were not verified in this pass.

Still open: local creator draft recovery and navigation warnings; safe email changes and the separately deferred email service, recovery and Google sign-in; verified contact destination; editable and reorderable recipe rows and inline editor errors; profile photo removal and password-section separation; list scroll restoration; owner-approved policies; broader visual consistency, reduced motion, image fallback and story excerpts; server-side admin pagination; and the remaining items in the review above. Checkout remains paused. Cook/preparation/rest time requires reliable data before adding fields. These are not completed by the follow-up changes.

## Second follow-up, 13 November 2026

The local checkout now also includes account-scoped drafts for the four creator editors, including ingredient and step text that has not yet been added. Drafts are recovered on the same device, can be discarded, and are cleared after a successful save. A browser warning is registered for reload or closing while changes are unsaved. Local drafts depend on browser storage; they do not sync across devices. In-app navigation relies on local recovery rather than a blocking warning.

Recipe ingredients and steps can be edited, removed, and moved. The editor reports missing content and image errors, blocks incomplete rows, and identifies image upload progress. Profile password changes have their own section and profile-photo removal has an explicit server operation. List return links attempt to restore the previous scroll position. The footer and hero have been adjusted, reduced-motion support added, story previews render Markdown, image fallbacks use consistent wording, and checkout result screens use clear text without claiming payment was confirmed.

Admin lists now use paginated and searchable queries, with the page and search in the URL. Existing non-paginated API responses remain available for the public catalog. The dashboard shows the result count and provides previous/next controls; grid sorting is disabled to avoid suggesting it sorts the entire database.

Validation: local browser checks covered creating and recovering recipe and story drafts, recovering unfinished ingredient text, moving an ingredient, saving and restoring a synthetic recipe, the profile layout, and admin search/results. The local integration tests covered pagination across 15 synthetic recipes, literal search, the old catalog response, protected user fields, explicit profile-photo removal, and existing blog/ownership workflows. The build and Git whitespace checks passed. Changes remain local.

Still deferred or unverified: owner-approved contact delivery and policies; verified email changes, registration verification, password recovery, and Google sign-in; verified checkout fulfillment; reliable prep/rest time and calorie basis data; complete browser, assistive-technology, real-device and performance testing; upload success against the real image service; and a full regression test of every journey. Scroll restoration and draft warning behavior have not been exhaustively verified across browsers. The browser bundle still reports a size warning.

## Third follow-up, 13 November 2026

Local changes add title/description/author search, recipe cook-time filters and sorting, story sharing, changing a rating, and a link-navigation warning for unsaved drafts. The homepage requests four recipes and four stories instead of the complete catalogs. Saving and unsaving is idempotent for the updated client, nonexistent recipes are rejected, and deleted recipes are removed from stored saved lists. Recipe, story and comment submissions reject blank or excessive text. Password hashes and refresh tokens are excluded from normal user queries. The API rejects unapproved browser origins, sets basic response headers, and exposes health/readiness endpoints.

Tests used only the synthetic database: the account, password, creator, recipe and admin integration checks passed, including repeated saves, concurrent rating changes, deleting saved content, and text limits. Browser checks covered the filters, story share menu and draft warning. Sampled home, recipe listing/detail and story listing layouts did not have document-wide horizontal overflow at the checked 320, 768 and 1440 px widths. The build and Git whitespace checks passed. These checks do not establish full accessibility or cross-browser coverage.

Open non-integration work remains: the general recipe and story catalogs and creator/saved collections are still fetched in full; account session storage still uses one unrotated refresh token per account; full role/account and navigation regression coverage is incomplete; the frontend lint command still reports unused imports and missing prop declarations; and the build still warns about a large JavaScript chunk. Scroll restoration, browser history with unsaved drafts, long content, keyboard and assistive technology need more coverage. These are not considered complete. The service- and owner-dependent items listed above remain pending.

## Fourth follow-up, 13 November 2026

Public recipe and story lists, saved recipes and creator collections now use scoped server-side pagination, search and sorting. Recipe filters use numeric cooking time. The existing list API remains available to older callers. Local tests covered more than one page, saved/author access, search, sorting and filters.

New sessions use independently revocable, hashed, rotating refresh tokens. Existing signed refresh cookies migrate on use. Refresh requests are coordinated in one tab and through Web Locks across supported tabs. Synthetic tests covered two sessions, token rotation and replay rejection, migration, device logout and password-change revocation. Two simultaneous browser tab reloads remained signed in. Browser storage and cross-site cookie behavior still need broader verification.

The frontend lint and production build pass. Direct component imports keep the admin table out of public pages, and React is split into its own chunk; all chunks fall below the build warning threshold. Browser checks of the built app covered sign-in, reload, the catalog and saved-recipe changes. Safari screen capture failed, and Firefox and Edge were unavailable. The build size improvement is not a substitute for timed performance measurements.

## Fifth follow-up, 13 November 2026

Catalog author details are now joined after selecting the page. In a local synthetic benchmark with 1,200 recipes, the warm median first-page request changed from 27.4 ms to 2.7 ms, and author search from 30.6 ms to 2.7 ms. Each figure is the median of seven warm requests on this machine; this is not a production or load-test result. The reusable benchmark is `server/local-test/catalog-benchmark.cjs` and deletes the synthetic records it creates.

For browsers without Web Locks, session refresh now uses an IndexedDB lease across tabs. Two simultaneous local refresh requests returned 200 with Web Locks disabled. If both Web Locks and IndexedDB are unavailable, coordination remains limited to one tab. Search/filter edits no longer force the page to the top; a local browser check showed the scroll position stayed at 55 pixels while entering a search.

Admin action labels, image-picker labels, share and back-to-top controls now use darker colors. The checked action text/background contrast changed from 1.74:1 to 8.69:1. This is a targeted color check, not a complete accessibility audit. Cross-browser, screen-reader, physical-device, production performance and external service checks remain open.
