import React from "react";
import { Button } from "..";
import { BsCheckLg } from "react-icons/bs";

const SubscribeCard = ({
  title,
  icon,
  price,
  subtitle,
  features,
  featureTitle,
  btnText,
}) => {
  return (
    <div className="flex flex-col gap-1 shadow bg-white rounded-lg p-8 hover:shadow-lg w-full">
      <div className="flex gap-3 items-center">
        {icon}
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <p className="text-gray-500 text-sm">{subtitle}</p>
      <h4 className="font-bold text-3xl my-4">{price}</h4>
      <Button
        content={btnText}
        customCss={"rounded text-sm"}
      />
      <div className="flex gap-2 flex-col mt-4">
        <h4 className="font-bold">{featureTitle}</h4>
        <ul className="flex flex-col gap-2">
          {features?.map((feature) => (
            <li
              className="flex gap-2 items-center"
              key={feature}
            >
              <BsCheckLg className="text-primary" />
              <span className="text-gray-500 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscribeCard;
