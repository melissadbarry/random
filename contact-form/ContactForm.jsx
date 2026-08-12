import { useState } from "react";

// Replace with your real Formspree form ID (from https://formspree.io/forms).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.status === 200) {
        setStatus("success");
        form.reset();
        return;
      }

      let message = "Something went wrong. Please try again.";
      const data = await response.json().catch(() => null);
      if (data && Array.isArray(data.errors) && data.errors.length) {
        message = data.errors.map((e) => e.message).join(", ");
      }
      setErrorMessage(message);
      setStatus("error");
    } catch (err) {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <p>Thanks! Your message has been sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={status === "submitting"}
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={status === "submitting"}
        />
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={status === "submitting"}
        />
      </div>

      {status === "error" && (
        <p className="contact-form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
