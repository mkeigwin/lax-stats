'use strict';
(() => {
  const erythang = document.body
  const laxGET = []

  function getLaxStats () {
    fetch(`/api`)
    .then (r => r.json())
    .then(data => {
      data.tasks.forEach(task => laxGET.push(task))
        console.log(laxGET)
      laxGET.forEach(stat => {
        const newNode = document.createTextNode(`Home==>${stat.home_team}, Away==>${stat.home_team}, Date==>${stat.date}`)
        const p = document.createElement('p')
        p.appendChild(newNode)
        erythang.appendChild(p)
      })
    })
    .catch(err => console.log(err))
  }


  getLaxStats ()

})();
