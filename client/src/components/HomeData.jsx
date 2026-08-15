import React from "react";

export const HomeData = ({ data }) => {
  return (
    <div className="card p-3">
      <i className={`${data.icon} fs-1`}></i>
      <h5>{data.title}</h5>
      <span className="text-muted">{data.text}</span>
    </div>
  );
};
