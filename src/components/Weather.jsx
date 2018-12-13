import React from "react";

const Weather = props => {
  return <div className={"weather"}>CURRENT WEATHER: {props.temp}</div>;
};

export default Weather;
