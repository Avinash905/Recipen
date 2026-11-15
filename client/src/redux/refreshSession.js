let pending;

// Web Locks stay held while a tab is suspended and are released when it closes.
// Expiring leases can overlap with a suspended request, so fail closed without them.
export function withSessionLock(operation) {
  if (typeof navigator === "undefined" || !navigator.locks?.request) {
    return Promise.reject(new Error("This browser cannot safely manage your session. Please try an updated browser."));
  }
  return navigator.locks.request("recipen-session-refresh", operation);
}

export function refreshSession(refresh) {
  if (!pending) pending = withSessionLock(refresh).finally(() => { pending = undefined; });
  return pending;
}
