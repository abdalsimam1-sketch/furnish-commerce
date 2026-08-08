import React from "react";

export const Input = ({ error, ...rest }) => {
  return (
    <div className="input-wrap">
      <input
        className={`input w-100 ${error ? "border-danger" : ""}`}
        {...rest}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
