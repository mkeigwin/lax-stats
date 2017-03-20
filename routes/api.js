const router = require('express').Router();
const { search } = require('../services/lax');

router.get('/', search, (req, res) => {
  res.json(res.stats);
});

module.exports = router;
