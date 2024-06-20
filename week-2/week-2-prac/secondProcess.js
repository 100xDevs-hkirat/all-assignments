var sendObj = {
  method: "POST",
};

function logResponseBody(jsonBody) {
  console.log(jsonBody);
}

function callBackFn(result) {
  result.json().then(logResponseBody);
}

fetch("http://localhost:3000/handleSum?counter=2", sendObj).then(callBackFn);
