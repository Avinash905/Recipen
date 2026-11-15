# Local synthetic test setup

This setup uses only `127.0.0.1:27028` and the `recipen_synthetic_test` database. It does not use the database or credentials shared for the deployed application. It is intended for local testing only.

From the project root, use `nvm install` and `nvm use` to select the Node.js version in `.nvmrc`. Install the client and server dependencies with `npm ci` in each directory.

The MongoDB 7.0.16 binary installed for this setup is in `~/Library/Caches/Recipen/mongodb`. Start it in a terminal with:

```sh
mkdir -p "$HOME/Library/Caches/Recipen/test-db"
"$HOME/Library/Caches/Recipen/mongodb/bin/mongod" --dbpath "$HOME/Library/Caches/Recipen/test-db" --bind_ip 127.0.0.1 --port 27028 --logpath "$HOME/Library/Caches/Recipen/mongodb-test.log"
```

With it running, from `server` run `node local-test/seed.cjs`. The seed script connects only to the fixed local address and inserts missing fixtures without overwriting existing records.

Start the backend with these local-only environment values:

```sh
PORT=5001 MONGODB_URI=mongodb://127.0.0.1:27028/recipen_synthetic_test ACCESS_TOKEN_SECRET=local-test-access-only REFRESH_TOKEN_SECRET=local-test-refresh-only CLIENT_BASE_URL=http://localhost:5173 node index.js
```

Start the frontend with `VITE_BASE_URL=http://localhost:5173 VITE_SERVER_BASE_URL=http://127.0.0.1:5001/api npm run dev -- --host 127.0.0.1`, then open `http://localhost:5173`.

Synthetic accounts are `basic@recipen.test`, `pro@recipen.test`, `other@recipen.test`, `admin@recipen.test`, and `disabled@recipen.test`. Their initial password is `RecipenTest123!`. The disabled account is intentionally unable to sign in. These credentials and signing keys are public test values and must never be used for a deployed environment.

Fixtures persist across restarts and may be changed by tests. Rerunning the seed adds missing fixtures but does not restore changed ones. Deleting the dedicated test data directory resets all local synthetic data; stop MongoDB first.

With the backend running, `node local-test/smoke.cjs` checks access and recipe operations against the synthetic database. It uses five sign-in attempts, so the login rate limit may temporarily block more sign-ins for one minute.

`node local-test/request-limits.cjs` checks the local registration and per-account write limits using invalid inputs. It intentionally exhausts those limits temporarily in the local server process. From `client`, `npm run test:account` checks that older account snapshots do not replace newer ones and that signing out clears account state.

With the backend and synthetic database running, `node local-test/comment-pages.cjs` checks recipe and story comment pagination and compatibility with the original detail responses. `node local-test/account-login-limit.cjs` runs a separate local server to check the account sign-in limit; it does not access the deployed application.

## Before deployment

The backend creates a case-insensitive unique email index before accepting requests. Existing duplicates can make startup fail, and legacy whitespace can bypass matching until addresses are normalized. Back up the target database and run the read-only `server/scripts/audit-account-emails.cjs` against it with its `MONGODB_URI` supplied through the environment. Resolve invalid, non-normalized, and duplicate addresses through a reviewed migration before deploying. Do not merge or delete user accounts automatically. The audit reports counts only and does not modify records.

Automated password recovery is not implemented: the application has no email delivery or recovery-token infrastructure. Users cannot reset a forgotten password through the app yet.
