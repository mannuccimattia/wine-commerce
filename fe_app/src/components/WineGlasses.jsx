import React from "react";

const WineGlasses = ({ rating }) => {
  console.log(rating);
  const renderGlasses = () => {
    return [1, 2, 3, 4, 5].map((_, i) => (
      <i
        key={`glass-${i}`}
        className={`fa-solid color-wine ${
          i < rating ? "fa-wine-glass" : "fa-wine-glass-empty"
        }`}
        style={{ marginRight: "5px" }}
      ></i>
    ));
  };

  return <div>{renderGlasses()}</div>;
};

export default WineGlasses;
