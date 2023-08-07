import React, { useState } from "react";
import { Comment, Button, Input } from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillPersonFill, BsCalendarCheck } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { useGetBlogQuery } from "../../features/blog/blogApiSlice";
import { useParams } from "react-router-dom";
import dateFormat from "../../common/dateFormat";

const SingleBlog = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { id } = useParams();
  const { data, isLoading } = useGetBlogQuery(id);

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleLogin = () => {};

  return (
    <section className="box flex flex-col gap-8">
      <div className="w-3/4 mx-auto flex flex-col gap-4">
        {/* Blog heading */}
        <h2 className="font-bold text-2xl md:text-4xl text-center mb-6">
          {data?.title}
        </h2>
        {/* Blog image */}
        <img
          src={data?.image}
          alt={data?.title}
          className="rounded w-full h-[500px] object-cover object-center"
        />
        {/* Blog author & date */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex text-sm md:text-lg gap-2 items-center font-bold">
            <BsFillPersonFill className="text-primary" />
            {data?.author?.name}
          </h3>
          <span className="flex gap-2 items-center text-sm">
            <BsCalendarCheck />
            {data && dateFormat(data?.createdAt)}
          </span>
        </div>

        {/* Blog content */}
        <p>{data?.description}</p>
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
          {data?.comments?.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SingleBlog;
