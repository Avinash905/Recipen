import assert from 'node:assert/strict';
import reducer, { logOut, setCredentials } from '../src/features/auth/authSlice.js';

const token = (userId, sessionId) => `e30.${Buffer.from(JSON.stringify({ UserInfo: { userId, sessionId, tokenVersion: 0 } })).toString('base64url')}.signature`;
const a = token('user-a', 'session-a');
const b = token('user-b', 'session-b');
let state = reducer(undefined, setCredentials({ accessToken: a, user: { userId: 'user-a', accountDataRevision: 2, favorites: ['new'] } }));
state = reducer(state, setCredentials({ accessToken: a, user: { userId: 'user-a', accountDataRevision: 1, favorites: ['old'] } }));
assert.deepEqual(state.user.favorites, ['new']);
state = reducer(state, setCredentials({ accessToken: b, user: { userId: 'user-b', accountDataRevision: 0, favorites: [] } }));
assert.equal(state.user.userId, 'user-b');
state = reducer(state, logOut());
assert.equal(state.user, null);
console.log('Passed: stale account responses, account switching and sign-out state.');
