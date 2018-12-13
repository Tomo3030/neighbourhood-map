import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

const MAP_CENTER = { lat: 46.341108, lng: -63.301649 };
const DEFAULT_ZOOM = 9;

const MyMapComponent = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={DEFAULT_ZOOM}
    defaultCenter={MAP_CENTER}
    onClick={e => props.onMapClick(e)}
    defaultOptions={{ mapTypeControl: false }}
  >
    {props.results.map((result, index) => {
      return (
        <Marker
          key={index}
          position={result.location}
          onClick={() => props.onSetTitle(result.title)}
        >
          {props.windowTitle === result.title && (
            <InfoWindow>
              <div className="result-info-window">
                <h2 className="result-name">{result.title}</h2>
                <p className="result-details">{result.about}</p>
                {props.displayMoreInfo ? (
                  props.loader ? (
                    <div className="loader" />
                  ) : props.photo ? (
                    <div className={"image-container"}>
                      <img
                        src={props.photo}
                        alt={result}
                        className={"infoImage"}
                      />
                    </div>
                  ) : (
                    <div className="no-photo">...sorry no photo available</div>
                  )
                ) : (
                  <span
                    className="show-image"
                    result={result.title}
                    onClick={() => props.onGetMoreInfo(result)}
                    tabIndex="0"
                  >
                    show image
                  </span>
                )}
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    })}
    {props.houseLocation && (
      <Marker
        position={props.houseLocation}
        icon={"https://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
        onClick={props.onHouseLocationClicked}
      />
    )}
  </GoogleMap>
));

class myMap extends Component {
  render() {
    return (
      <div className={this.props.sideBarToggle ? "map" : "map-full"}>
        <MyMapComponent
          results={this.props.results}
          zoom={DEFAULT_ZOOM}
          center={MAP_CENTER}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          onSetTitle={this.props.onSetTitle}
          windowTitle={this.props.windowTitle}
          onMapClick={this.props.onMapClick}
          houseLocation={this.props.houseLocation}
          onHouseLocationClicked={this.props.onHouseLocationClicked}
          onGetMoreInfo={this.props.onGetMoreInfo}
          photo={this.props.photo}
          imageToggle={this.props.imageToggle}
          loader={this.props.loader}
          displayMoreInfo={this.props.displayMoreInfo}
        />
      </div>
    );
  }
}

export default myMap;
