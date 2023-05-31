import React from "react";
import { Link } from "react-router-dom";
import backIcon from "../../assets/img/leftArrow.png";
function BackButton({ title, icon = { backIcon }, url = "/" }) {
  return (
    <div className="flex justify-center">
      <Link to={url}>
        <div className="text-center text-btn-bg-top inline-flex space-x-2 items-center ">
          <img src={icon} className="w-4 h-[10px]" alt="BackButtonIcon" />{" "}
          <span>{title}</span>
        </div>
      </Link>
    </div>
  );
}

export default BackButton;
