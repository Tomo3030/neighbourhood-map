import React from "react";

const Sidebar = props => {
  //we are making categories for each type of item on the map. And then populating each category
  let sideBarListItem = [];
  for (var i = 0; i < props.typeOfPlaces.length; i++) {
    let element = props.typeOfPlaces[i];
    let typeList = props.results.filter(result => result.type === element);
    let itemInfo = typeList.map((location, index) => (
      <li
        key={index}
        className="sidebar-list-item"
        onClick={() => props.onSetTitle(location.title)}
        tabIndex="0"
        role="button"
      >
        <div className="sidebar-text">
          <div className="sidebar-location-title">{location.title}</div>
          <div className="sidebar-image-container">
            <div>
              <img
                className="icon"
                src={window.location.origin + "/images/car.png"}
                alt={"car"}
              />
            </div>
            <div className="sidebar-results">{location.distance}</div>
          </div>
          <div className="sidebar-image-container">
            <div>
              <img
                className="icon"
                src={window.location.origin + "/images/time.png"}
                alt={"time"}
              />
            </div>
            <div className="sidebar-results">{location.duration}</div>
          </div>
        </div>
      </li>
    ));
    sideBarListItem.push(
      <li
        key={element}
        className={"item-header"}
        onClick={props.onFilterResults}
        tabIndex="0"
        role="button"
      >
        {element}
        <img
          src={window.location.origin + "/images/expand.png"}
          alt={"expandable arrow"}
          className={props.typeOfPlacesDisplayed[element] ? "down" : "up"}
          onClick={props.onFilterResults}
        />
      </li>,
      itemInfo
    );
  }
  return (
    <ul className={props.sideBarToggle ? "sidebar" : "sidebar-closed"}>
      {sideBarListItem}
    </ul>
  );
};

export default Sidebar;
