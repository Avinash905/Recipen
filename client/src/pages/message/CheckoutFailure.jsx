import { Link } from "react-router-dom";

export default function CheckoutResult() {
  return <section className="box py-20 text-center"><h1 className="font-serif text-4xl">Payment was not completed</h1><p className="mt-4 text-[#6b6257]">If you were charged, please check your payment provider before trying again. New checkout is currently unavailable.</p><Link to="/" className="mt-6 inline-block rounded-full bg-[#29251f] px-6 py-3 font-semibold text-white">Back to home</Link></section>;
}
