import React, { useState } from "react";
import { Comment } from "../../components";
import { Button, Input } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillPersonFill, BsCalendarCheck } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

const index = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="box flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {/* Blog image */}
        <img
          src="https://images.pexels.com/photos/9609842/pexels-photo-9609842.jpeg?auto=compress&cs=tinysrgb&w=750&dpr=1"
          alt=""
          className="rounded w-full h-[500px] object-cover object-center"
        />
        {/* Blog author & date */}
        <div className="flex justify-between items-center">
          <h3 className="flex text-md md:text-xl gap-2 items-center font-bold">
            <BsFillPersonFill className="text-primary" />
            John Doe
          </h3>
          <span className="flex gap-2 items-center text-sm">
            <BsCalendarCheck />
            05 May 2023
          </span>
        </div>
        {/* Blog heading */}
        <h2 className="font-bold text-2xl md:text-4xl">
          What's the Difference Between Prawns & Shrimp?
        </h2>
        {/* Blog content */}
        <p className="text-md md:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          blanditiis harum quaerat possimus porro debitis aut distinctio a in
          fugit eligendi ratione, cum error sint ipsa inventore. At ipsam totam
          dolores possimus facilis asperiores quisquam nam consequuntur nihil
          molestiae, sit, perferendis esse laudantium earum sequi ipsa fugit id,
          tenetur quia! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Iste recusandae soluta consequuntur culpa modi eaque eveniet ut nulla
          magni molestiae iusto facilis quo illum, non corporis, quae, ducimus
          repellendus consectetur. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Corrupti rem eius, aperiam assumenda ipsum, et
          dolores dolor deleniti saepe beatae autem consequuntur repellendus
          corporis. Consequuntur, corrupti architecto nesciunt veritatis ad enim
          veniam reprehenderit numquam necessitatibus aliquid officiis dolor
          earum et.
        </p>
      </div>
      <hr />
      {/* Blog write comment */}
      <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
        <h3 className="font-bold text-2xl">Leave a Reply</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          <Input
            type={"text"}
            id={"name"}
            icon={<AiOutlineUser />}
            handleChange={handleChange}
            value={formDetails.name}
            label={"Name"}
            placeholder={"John Doe"}
          />
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
              Comment
            </label>
            <textarea
              onChange={handleChange}
              value={formDetails.message}
              id="message"
              rows={4}
              required
              aria-required="true"
              aria-describedby="message-error"
              placeholder="Leave a comment..."
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
            content={"Post comment"}
            icon={<FaRegPaperPlane />}
            type={"submit"}
            customCss={"rounded-lg gap-3 max-w-max"}
          />
        </form>
      </div>
      <hr />
      {/* Blog comments */}
      <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-6">
        <h3 className="font-bold text-2xl">Comments</h3>
        <div className="flex flex-col gap-6">
          <Comment />
          <Comment />
          <Comment />
        </div>
      </div>
    </section>
  );
};

export default index;
