const fetch = require('node-fetch');
// const API_KEY = process.env.Password;

function search(req, res, next) {
  fetch(`http://tsacchet.pythonanywhere.com//tasks/`)
  .then(r => r.json())
  .then((data) => {
    res.stats = data;
    next();
  })
  .catch((err) => {
    console.log(err);
    res.err = err;
    next();
  });
}

module.exports = { search };
