import P from "prop-types";
import { logoNoBg } from "../../assets";
import { Link } from "react-router-dom";

const Logo = ({ customCss, hideName = false }) => {
  return (
    <Link
      to={"/"}
      className={`max-w-max ${customCss}`}
    >
      <div className="flex gap-1.5 items-center">
        <div className="w-12">
          <img
            src={logoNoBg}
            alt="recipen logo"
            className="w-full h-full"
          />
        </div>
        {!hideName && <span className="font-bold text-xl">Recipen</span>}
      </div>
    </Link>
  );
};

Logo.propTypes = { customCss: P.string, hideName: P.bool };

export default Logo;
