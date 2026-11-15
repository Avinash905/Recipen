import { useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";

// Drafts are kept on this device and separated by account and editor.
export default function useCreatorDraft(editor, values, setValues, ready = true) {
  const user = useAuth();
  const key = user?.userId ? `recipen-draft:${user.userId}:${editor}` : null;
  const initialized = useRef(null);
  const baseline = useRef(null);
  const [status, setStatus] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    if (!ready || !key) return;
    const serialized = JSON.stringify(values);
    if (initialized.current !== key) {
      initialized.current = key;
      baseline.current = serialized;
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const draft = JSON.parse(saved);
          if (draft && typeof draft === "object" && !Array.isArray(draft)) {
            setValues({ ...values, ...draft });
            setStatus("Recovered an unsaved draft from this device.");
          }
        }
      } catch { setStorageAvailable(false); }
      return;
    }
    try {
      if (serialized === baseline.current) {
        localStorage.removeItem(key);
        setStatus((previous) => previous.startsWith("Unsaved") || previous.startsWith("Recovered") ? "" : previous);
      } else {
        localStorage.setItem(key, serialized);
        setStatus("Unsaved changes. A draft is saved on this device.");
      }
    } catch {
      setStorageAvailable(false);
      setStatus("Unsaved changes. Draft storage is unavailable.");
    }
  }, [key, ready, values, setValues]);

  useEffect(() => {
    if (!ready || !key || JSON.stringify(values) === baseline.current) return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [key, ready, values, status]);

  const markSaved = (savedValues) => {
    baseline.current = JSON.stringify(savedValues);
    try { if (key) localStorage.removeItem(key); } catch { setStorageAvailable(false); }
    setStatus("Saved successfully.");
  };
  const dirty = Boolean(key && initialized.current === key && baseline.current !== JSON.stringify(values));
  useEffect(() => {
    if (!dirty) return;
    const warnOnNavigation = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      const prompt = storageAvailable ? "You have unsaved changes. A draft is saved on this device. Leave this page?" : "You have unsaved changes and draft storage is unavailable. Leave this page?";
      if (!window.confirm(prompt)) { event.preventDefault(); event.stopPropagation(); }
    };
    document.addEventListener("click", warnOnNavigation, true);
    return () => document.removeEventListener("click", warnOnNavigation, true);
  }, [dirty, storageAvailable]);

  const discardDraft = () => {
    if (!dirty || !window.confirm("Discard your unsaved changes?")) return;
    try {
      const original = JSON.parse(baseline.current);
      localStorage.removeItem(key);
      setValues(original);
      setStatus("Draft discarded.");
    } catch { setStatus("Could not discard the draft on this device."); }
  };
  return { status, markSaved, dirty, discardDraft, storageAvailable };
}
