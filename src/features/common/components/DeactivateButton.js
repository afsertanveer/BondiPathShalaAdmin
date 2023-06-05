import React from "react";

const DeactivateButton = ({ setter, value }) => {
  return (
    <label
      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
      htmlFor="my-modal-1"
      onClick={() => setter(value)}
    >
      Deactivate
    </label>
  );
};

export default DeactivateButton;
