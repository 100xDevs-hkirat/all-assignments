//#region imports
const fetch = require("cross-fetch");
const express = require("express");
//#endregion

const queryStr = "?counter=20";
const url = "https://5zhhcs-3000.csb.app/handleSum" + queryStr;
const sendObj = { method: "GET" };

const fetchThenCb = (jsonBody) => {
  console.log(jsonBody);

  // send jsonBody to page
  const app = express();
  app.listen(3001);
  app.get("/", (req, res) => {
    res.send(jsonBody);
  });
};

const fetchCb = (result) => {
  const resJsonPromise = result.json();
  //resJsonProm.then(fetchThenCb);
  return resJsonPromise;
};

const fetchPromise = fetch(url, sendObj);

fetchPromise.then(fetchCb).then(fetchThenCb);
