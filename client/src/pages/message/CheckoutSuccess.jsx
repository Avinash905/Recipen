import React from "react";
import { paymentSuccessful } from "../../assets";
import Message from "./Message";

const CheckoutSuccess = () => {
  return (
    <Message
      animation={paymentSuccessful}
      loop={false}
    />
  );
};

export default CheckoutSuccess;
