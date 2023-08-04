import React from "react";
import SubscribeCard from "../cards/SubscribeCard";
import { AiOutlineThunderbolt } from "react-icons/ai";

const index = () => {
  return (
    <section className="box flex flex-col gap-10 mt-28 items-center">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold text-3xl text-center">
          Pay once, use forever
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          perferendis optio omnis? Id, ipsa eos.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full md:w-[80%] lg:w-[50%]">
        <SubscribeCard
          title={"Basic"}
          icon={
            <AiOutlineThunderbolt className="bg-primary text-light rounded-full p-1 text-3xl shadow-lg" />
          }
          price={"Free"}
          subtitle={"Perfect to get started"}
          featureTitle={"Basic includes:"}
          features={["hello1", "hello2"]}
          btnText={"Continue for free"}
        />
        <SubscribeCard
          title={"Pro"}
          icon={
            <AiOutlineThunderbolt className="bg-primary text-light rounded-full p-1 text-3xl shadow-lg" />
          }
          price={"$12"}
          subtitle={"Best for professionals"}
          featureTitle={"Everything in Basic, plus:"}
          features={["hello1", "hello2", "hello3"]}
          btnText={"Get started"}
        />
      </div>
    </section>
  );
};

export default index;
