import React, { Component } from "react";
import { Button } from "react-bootstrap";

const CustomButton = (props) => {
  const { fill, simple, pullRight, round, block, ...rest } = props;

  const btnClasses = {
    "btn-fill": fill,
    "btn-simple": simple,
    "pull-right": pullRight,
    "btn-block": block,
    "btn-round": round,
  };

  return <Button className={btnClasses} {...rest} />;
};

export default CustomButton;
