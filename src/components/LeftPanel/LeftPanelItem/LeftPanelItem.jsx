import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function LeftPanelItem({ isActive, linkTo, SolidIcon, OutlineIcon, text }) {
  return (
    <li className="flex items-center space-x-2">
      <NavLink to={linkTo} className="flex w-full group items-center space-x-2">
        <div className="group-hover:bg-slate-700 flex rounded-full p-2 pr-7">
          {isActive ? <SolidIcon className="size-6" /> : <OutlineIcon className="size-6" />}
          <span className={`ml-4 text-xl hidden xl:inline ${isActive ? "font-bold" : ""}`}>
            {text}
          </span>
        </div>
      </NavLink>
    </li>
  );
}

LeftPanelItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  linkTo: PropTypes.string.isRequired,
  SolidIcon: PropTypes.elementType.isRequired,
  OutlineIcon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
};
