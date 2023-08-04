import React, { useState } from "react";
import { Button, Input } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { motion } from "framer-motion";

const index = () => {
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="box flex flex-col-reverse md:flex-row w-full gap-12 md:gap-6 justify-center items-center">
      {/* Contact page left */}
      <div className="basis-1/2 lg:basis-1/3 bg-gradient-to-t from-yellow-100 via-yellow-300 to-yellow-400 rounded-2xl px-10 py-10 h-full w-[100%] sm:w-[80%] md:w-[100%] text-center md:text-start">
        <h3 className="font-bold text-xl mb-6">Get in touch</h3>
        <div className="mb-5 flex flex-col gap-1">
          <h4 className="font-bold">Visit us</h4>
          <p>Come say hello to our office</p>
          <p className="font-semibold text-sm">
            Friends Colony, Mumbai, Maharashtra 400070
          </p>
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <h4 className="font-bold">Chat with us</h4>
          <p>Our team is here to help</p>
          <a
            href="mailto:recipen@abc.com"
            className="font-semibold text-sm"
          >
            recipen@abc.com
          </a>
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <h4 className="font-bold">Call us</h4>
          <p>Mon-Fri from 9am to 6pm</p>
          <a
            href="tel:+919876543210"
            className="font-semibold text-sm"
          >
            +91 9876543210
          </a>
        </div>
        <div className="mb-5 flex flex-col gap-3">
          <h4 className="font-bold">Social media</h4>
          <ul className="flex justify-center md:justify-start gap-4 text-xl">
            <motion.li
              className="hover:text-gray-500"
              whileHover={{ y: -4 }}
            >
              <a href="https://github.com/Avinash905">
                <AiFillGithub />
              </a>
            </motion.li>
            <motion.li
              className="rounded-full hover:text-blue-400"
              whileHover={{ y: -4 }}
            >
              <a href="https://twitter.com/avinashdunna">
                <AiFillTwitterCircle />
              </a>
            </motion.li>
            <motion.li
              className="rounded-full hover:text-blue-600"
              whileHover={{ y: -4 }}
            >
              <a href="https://www.linkedin.com/in/dunna-avinash">
                <AiFillLinkedin />
              </a>
            </motion.li>
          </ul>
        </div>
      </div>
      {/* Contact form container */}
      <div className="basis-1/2 lg:basis-1/4 m-auto flex flex-col">
        {/* Contact form container details */}
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="font-bold text-3xl">We'd love to help</h2>
          <p className="text-sm">
            Reach out and we'll get in touch in 24 hours
          </p>
        </div>
        {/* Contact form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          <div className="flex gap-4 flex-col sm:flex-row md:flex-col lg:flex-row">
            <Input
              type={"text"}
              id={"firstName"}
              icon={<IoMailOutline />}
              handleChange={handleChange}
              value={formDetails.firstName}
              label={"First Name"}
              placeholder={"John"}
            />
            <Input
              type={"text"}
              id={"lastName"}
              icon={<IoMailOutline />}
              handleChange={handleChange}
              value={formDetails.lastName}
              label={"Last Name"}
              placeholder={"Doe"}
            />
          </div>
          <Input
            type={"email"}
            id={"email"}
            icon={<IoMailOutline />}
            handleChange={handleChange}
            value={formDetails.email}
            label={"Email"}
            placeholder={"example@abc.com"}
          />
          <div className="flex flex-col relative ">
            <label
              htmlFor="message"
              className="text-sm font-semibold mb-3"
            >
              Message
            </label>
            <textarea
              onChange={handleChange}
              value={formDetails.message}
              id="message"
              rows={6}
              required
              aria-required="true"
              aria-describedby="message-error"
              placeholder="Leave us a message"
              className="py-2 px-4 border-red-500 border bg-gray-100 rounded-lg focus:outline outline-primary"
            />
            <span
              id="message-error"
              className="text-red-500 pl-2 text-sm mt-1"
            >
              Invalid email
            </span>
          </div>
          <Button
            content={"Send message"}
            icon={<FaRegPaperPlane />}
            type={"submit"}
            customCss={"rounded-lg gap-3"}
          />
        </form>
      </div>
    </section>
  );
};

export default index;
