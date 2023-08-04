import React from "react";
import { Button, SingleCard } from "..";

const index = ({ mainTitle, tagline, type }) => {
  return (
    <section className="box flex flex-col items-center">
      <div className="flex flex-col items-center gap-5 w-full mb-10">
        {/* Main heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-start">
          {mainTitle}
        </h2>
        {/* Subtitle */}
        <p className="text-center">{tagline}</p>
        {/* Search */}
        <div className="border-gray-200 border-2 flex p-1 pl-4 rounded-lg mt-4 w-[80%] sm:w-[50%] md:w-[30%]">
          <input
            type="text"
            className="focus:outline-none w-full"
            placeholder={`Search ${type}...`}
          />
          <Button
            content={"Search"}
            customCss={"max-w-max rounded-lg"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {/* Sub heading */}
        <h3 className="font-bold text-xl">Recent {type}</h3>
        {/* Cards container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <SingleCard />
        </div>
      </div>
    </section>
  );
};

export default index;
