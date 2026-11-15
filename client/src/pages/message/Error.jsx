import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const Error = () => {
  useTitle("Recipen - Page not found");
  return <section className="box py-20 text-center"><h1 className="font-serif text-4xl">Page not found</h1><p className="mt-4 text-[#6b6257]">This page may have moved or the address may be incorrect.</p><Link to="/" className="mt-6 inline-block rounded-full bg-[#29251f] px-6 py-3 font-semibold text-white">Back to home</Link></section>;
};
export default Error;
