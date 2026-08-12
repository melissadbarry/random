# Contact Form (React + Formspree)

A contact form with `name`, `email`, and `message` fields that submits
directly to [Formspree](https://formspree.io) via `fetch`.

## Files

- `ContactForm.jsx` — the reusable React component. Drop it into any
  React project (Vite, Create React App, Next.js, etc.).
- `demo.html` — a standalone, no-build-step demo you can open directly
  in a browser (loads React + Babel from a CDN) to try the form live.

## Setup

1. Create a form at [formspree.io/forms](https://formspree.io/forms) and
   copy its form ID.
2. Replace `YOUR_FORM_ID` in the `FORMSPREE_ENDPOINT` constant (in both
   `ContactForm.jsx` and `demo.html`, if you're using the demo) with
   your real ID:

   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```

## Behavior

- On submit, the form `POST`s the `FormData` (built from the form's
  `name`/`email`/`message` inputs) to the Formspree endpoint with the
  `Accept: application/json` header set, so Formspree returns JSON
  instead of redirecting.
- The success view is only shown after the `fetch` call resolves with
  an HTTP `200` status.
- Any other status (validation errors, non-200 responses) or a network
  failure shows an inline error message instead, using Formspree's
  returned error details when available.
- The submit button is disabled while the request is in flight.
