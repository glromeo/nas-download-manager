import "./commonContext";

import { saveLastSevereError } from "../errorHandlers";

// TODO: When browser support this natively or Bluebird starts working again.
// window.addEventListener('unhandledrejection', (e: any) => {
//   e.preventDefault();
//   onUnhandledError(e && e.detail && e.detail.reason);
// });

globalThis.addEventListener("error", (e) => {
  e.preventDefault();
  saveLastSevereError(e.error);
});
