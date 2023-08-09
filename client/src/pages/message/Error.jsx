import { errorAnimation } from "../../assets";
import Message from "./Message";

const Error = () => {
  return (
    <Message
      animation={errorAnimation}
      loop={true}
    />
  );
};

export default Error;
