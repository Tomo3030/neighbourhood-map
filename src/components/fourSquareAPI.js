const CLIENT_ID = "V4BGOPQGQKKJF5G3K3KBPIJW2N25QFO4L0RFAB54JKW4J0AS";
const CLIENT_SECRET = "5NUAE2HJENTGTOAL5CET135Y2YNJI##############";
const BASE_URL = "https://api.foursquare.com/v2";
const RADIUS = "300";
const RESULT_LIMIT = "1";
const VERSION = "20181207";

export const getId = (lat, lng, name) => {
  return `${BASE_URL}/venues/search?ll=${lat},${lng}&limit=${RESULT_LIMIT}&radius=${RADIUS}&query=${name}&v=${VERSION}
&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
};

export const getDetails = id => {
  return `${BASE_URL}/venues/${id}?&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}`;
};
