import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Contact = () => {
  const user = useAuth();
  useTitle("Recipen - Contact");
  const [form, setForm] = useState({ name: "", email: user?.email || "", message: "" });
  const [status, setStatus] = useState("idle");
  const formId = import.meta.env.VITE_FORMIK_SECRET;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setStatus("sending");
    try {
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setForm({ ...form, name: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
  const field = "mt-2 w-full rounded-xl border border-[#d5c9b7] bg-white px-4 py-3 focus:outline focus:outline-2 focus:outline-[#775421]";
  return <section className="box py-10 md:py-16"><div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Get in touch</p><h1 className="mt-3 font-serif text-4xl">Contact Recipen</h1><p className="mt-4 leading-7 text-[#6b6257]">{formId ? "Have a question or feedback? Send us a message using the form." : "Have a question or feedback?"}</p></div>
    {formId ? <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl border border-[#e8e1d7] bg-[#fbf8f3] p-6 sm:p-8">
      <label className="text-sm font-semibold">Name<input className={field} name="name" value={form.name} onChange={change} required /></label>
      <label className="text-sm font-semibold">Email<input className={field} name="email" type="email" value={form.email} onChange={change} required /></label>
      <label className="text-sm font-semibold">Message<textarea className={field} name="message" rows={6} value={form.message} onChange={change} required /></label>
      {status === "success" && <p role="status" className="text-green-800">Your message was submitted.</p>}
      {status === "error" && <p role="alert" className="text-red-700">Could not send your message. Your text is still here; please try again.</p>}
      <button type="submit" disabled={status === "sending"} className="rounded-full bg-[#29251f] px-5 py-3 font-semibold text-white disabled:opacity-60">{status === "sending" ? "Sending..." : "Send message"}</button>
    </form> : <p className="rounded-2xl bg-[#fbf8f3] p-6">The contact form is temporarily unavailable.</p>}
  </div></section>;
};
export default Contact;
