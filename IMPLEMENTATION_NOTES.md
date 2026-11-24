# Handy Hive – Updates to the uploaded Expo project

This ZIP is a modification of the original **HandyHive-main (1).zip**, not a separate React/Vite app. It preserves the Expo 54, React Native, app navigation and the original styling direction (yellow for clients, blue for workers, red for admin).

## Run in VS Code

1. Extract this archive. Open the `HandyHive-main` folder in VS Code.
2. Install Node.js 20+ and run `npm ci` from the project root (requires network access).
3. Run `npm start` for Expo, `npm run web` for web, or use the normal Expo commands in `package.json`.
4. Example accounts are seeded by `data/database.js`: `admin1@hive.com`, `jane.doe@hive.com`, `juan.dc@worker.com`, all initially have `password123` (school DEMO only).
5. Run `npm run test:logic` for the pure business-rule tests.

## Changes implemented

- Replaced static admin reports with interactive, saved client reports and *Pending*, *Under Investigation*, and *Reviewed* states.
- Updated report decisions send persistent in-app notifications to the submitting client.
- Metrics use real saved records (monthly graph excludes old seed bookings without creation dates).
- Category *Archive* / *Unarchive* preserves workers and historical bookings; archived categories are omitted from new registration, worker category changes, and new booking selections.
- Client Bookings now has Pending, Upcoming, Completed, and Cancelled tabs, with reschedule/cancel actions on eligible bookings, and ratings/reports on completed jobs.
- Worker Requests and Jobs have clickable full-detail modals. Workers can accept/decline requests and mark active jobs as completed. Job logs and booking notifications include status and schedule changes.
- Profiles can edit name, email, phone, age, birthdate, and for workers: bio, certifications, service area, schedule, category, minimum fee. Change password validates the current password.
- Worker registration requires a positive Minimum Service Fee, replacing a fixed hourly-rate placeholder. Worker listings, worker detail, booking forms and admin user view show the minimum fee.
- Login and registration offer show/hide password; Expo Web alerts/confirmations work through a shared adapter.
- All role data is read from **AsyncStorage** via `data/database.js` and updated through `AppContext`.

## Storage / migration

**Important correction:** The actual uploaded project uses `@react-native-async-storage/async-storage`, not directly `window.localStorage`. On Expo Web, the storage implementation may use browser local storage. Neither enables data synchronization across different phones or browsers.

Existing collections are preserved under the original `HH_STORAGE_*` keys. Four new keys are independently initialized (without wiping previous users/bookings):

- `HH_STORAGE_REPORTS`
- `HH_STORAGE_REVIEWS`
- `HH_STORAGE_NOTIFICATIONS`
- `HH_STORAGE_ARCHIVED_CATEGORIES`

Legacy worker fees stored as strings like `₱300/hr` are copied into numeric `minimumServiceFee` **as provisional demo values**, with `pricingNeedsReview: true`. The original rate string is retained as `legacyRate` for audit. Workers should confirm or change their minimum fee in Manage Profile; a historical hourly rate is **not** a validated minimum-service price.

Future booking dates require `YYYY-MM-DD`, with 24-hour time `HH:mm`. This avoids ambiguous booking strings in the original form.

## End-to-end manual verification

1. Client login as Jane Doe and book a future job with Juan; check Pending.
2. Log out and sign in as Juan; view Requests, open the modal, accept.
3. Return as Jane, reschedule or cancel a booking; sign in as Juan to see the updated schedule, logs and notification.
4. Accept a second job as Juan and mark it Completed; as Jane, open the Completed tab, submit 1–5 stars and a provider report.
5. Log in as admin; open the report from Home, mark Under Investigation then Reviewed.
6. As Jane, open Alerts and check each status notification.
7. As admin, archive Plumbing; confirm workers remain in storage, old jobs still exist, and new category choices no longer show Plumbing. Unarchive to restore.
8. Edit profile data and change passwords for each role. Reopen the same local app installation to verify changes were persisted.
9. Check dashboard counts and graph after creating bookings/reports; no invented statistics should appear.

## Current limitations / disclosures

- This remains a **classroom demo**, not production security: existing code stores passwords in plain text in AsyncStorage. No real server authentication, trusted role authorization, multi-device synchronization, secure personal-record sharing, push notifications or password hashing has been added. Those require a secure backend and a reviewed data migration.
- In-app notifications are persisted in this local installation and appear when switching accounts here. They **will not reach another person's device**.
- The "reference photo" button from the original booking form was a nonfunctional visual placeholder; this update removes that misleading control instead of claiming the app can upload images without a service.
- Worker certifications remain editable text as in the original project; certificate document upload and verification require additional implementation.
- Real-world customer/payment processing, AI, price validation, and in-app negotiated-price confirmations were not part of this code update.
- Unit tests were run for core business rules and the source was syntax-parsed. A full Expo mobile/web runtime build still requires local dependency installation and device/browser testing.
