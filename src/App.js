import React, { Component } from "react";
import "./App.css";
import Map from "./components/Map";
import myPlaces from "./places2";
import Sidebar from "./components/Sidebar";
import * as fourSquareAPI from "./components/fourSquareAPI";
// import Weather from "./components/Weather";

class App extends Component {
  state = {
    results: myPlaces,
    windowTitle: null,
    houseLocation: {},
    typeOfPlaces: [],
    typeOfPlacesDisplayed: [],
    toggleExpanded: true,
    temp: null,
    photo: null,
    imageToggle: "show image",
    loader: false,
    displayMoreInfo: false,
    sideBarToggle: true
  };

  componentDidMount() {
    //here we want to get all the different 'types' of locations from my places
    const typeOfPlaces = this.state.results
      .map(result => result.type)
      .filter((v, i, a) => a.indexOf(v) === i);
    this.setState({ typeOfPlaces });
    let typeOfPlacesDisplayed = typeOfPlaces.reduce(
      (acc, cur) => ({ ...acc, [cur]: true }),
      {}
    );
    this.setState({ typeOfPlaces, typeOfPlacesDisplayed });
  }

  mapClick = e => {
    if (this.state.windowTitle !== null) {
      this.setState({ windowTitle: null, photo: null });
    } else if (!this.state.windowTitle) {
      this.setState({ houseLocation: e.latLng });
      let service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [e.latLng],
          destinations: this.state.results.map(location => location.location),
          travelMode: "DRIVING"
        },
        this.setDistances
      );
    }
  };
  setDistances = results => {
    console.log(results);
    let placesWithDistances = this.state.results.slice();
    if (results.rows[0].elements[0].status !== "ZERO_RESULTS") {
      for (let i = 0; i < placesWithDistances.length; i++) {
        placesWithDistances[i].distance =
          results.rows[0].elements[i].distance.text;
        placesWithDistances[i].duration =
          results.rows[0].elements[i].duration.text;
      }
    } else {
      for (let i = 0; i < placesWithDistances.length; i++) {
        placesWithDistances[i].distance = "-";
        placesWithDistances[i].duration = "-";
      }
    }
    this.setState({ result: placesWithDistances });
  };

  setTitle = result => {
    //this is really hacky. But the problem is that i can't get the infoWindow onCloseClick to work. If that command did work, I would change windowTitle, and photo to null there. I need windoTitle here because if you open a particular infoBox by pressing on the marker, and then close it with the X button the windowTitle does not change. So if you try to open it again it (the same window) the state registers no change and does not open.
    //console.log(e.target.className);
    if (this.state.windowTitle) this.setState({ windowTitle: null });
    this.setState({
      windowTitle: result,
      photo: null,
      loader: false,
      displayMoreInfo: false
    });
  };

  filterResults = e => {
    // there must be a more elegant way to do this, but this works. The problem is that the image in the div was not firing this function.
    //now we need to add this mess because if the infoWindow wasn't closed properly then it opens when you filter the results.
    this.setState({ windowTitle: null });
    let x = e.target.innerText
      ? e.target.innerText.toLowerCase()
      : e.target.parentNode.innerText.toLowerCase();
    let typeOfPlacesDisplayed = { ...this.state.typeOfPlacesDisplayed };
    typeOfPlacesDisplayed[x] = !typeOfPlacesDisplayed[x];
    this.setState({ typeOfPlacesDisplayed });
    let filtered = myPlaces.filter(
      result => typeOfPlacesDisplayed[result.type]
    );

    this.setState({
      results: filtered,
      toggleExpander: !this.state.toggleExpander
    });
  };

  getMoreInfo = result => {
    this.setState({
      displayMoreInfo: !this.state.displayMoreInfo,
      loader: !this.state.loader
    });
    let title = result.title;
    let lat = result.location.lat;
    let lng = result.location.lng;
    fetch(fourSquareAPI.getId(lat, lng, title))
      .then(response => response.json())
      .then(response => response.response.venues[0])
      .then(response =>
        response
          ? fetch(fourSquareAPI.getDetails(response.id)).then(response =>
              response.json().then(response => {
                if (
                  response.meta.code === 200 &&
                  response.response.venue.bestPhoto
                ) {
                  let prefix = response.response.venue.bestPhoto.prefix;
                  let suffix = response.response.venue.bestPhoto.suffix;
                  return prefix + 150 + suffix;
                }
              })
            )
          : null
      )
      .then(result =>
        this.setState({ photo: result, loader: !this.state.loader })
      );
  };

  menuToggle = () => {
    this.setState({ sideBarToggle: !this.state.sideBarToggle });
  };

  render() {
    return (
      <div className={"container"}>
        <Sidebar
          results={this.state.results}
          onSetTitle={this.setTitle}
          typeOfPlaces={this.state.typeOfPlaces}
          typeOfPlacesDisplayed={this.state.typeOfPlacesDisplayed}
          onFilterResults={this.filterResults}
          toggleExpander={this.state.toggleExpander}
          sideBarToggle={this.state.sideBarToggle}
        />
        <Map
          results={this.state.results}
          onSetTitle={this.setTitle}
          windowTitle={this.state.windowTitle}
          onMapClick={this.mapClick}
          houseLocation={this.state.houseLocation}
          onHouseLocationClicked={this.houseLocationClicked}
          onGetMoreInfo={this.getMoreInfo}
          photo={this.state.photo}
          imageToggle={this.state.imageToggle}
          loader={this.state.loader}
          displayMoreInfo={this.state.displayMoreInfo}
          sideBarToggle={this.state.sideBarToggle}
        />
        <div className={"hamburger-helper"}>
          <img
            className={"hamburg"}
            src={window.location.origin + "/images/menu.png"}
            alt={"hamburgaler menu"}
            onClick={this.menuToggle}
          />
        </div>
      </div>
    );
  }
}

export default App;
