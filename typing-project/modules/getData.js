async function getData(url) {
    let myPromise = new Promise(function(myResolve, myReject) {
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          myResolve(JSON.parse(req.responseText));
        } else {
          myReject({});
        }
      };
      req.send();
    });
    return await myPromise;
  }

  module.exports = {
    getData
  };