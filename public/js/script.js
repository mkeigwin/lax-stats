'use strict';
(() => {
  const loadWheel = document.querySelector('.loadWheel')
  const pastGames = document.querySelector('.pastGames')
  const futureGames = document.querySelector('.futureGames')

  const laxGET = []
  const groupDate = []
  const today = new Date();
  const month = today.getMonth()+1
  let day
  if (today.getDate() < 10) {
    day = `0${today.getDate()}`
  } else {
    day = today.getDate()
  }
  const dayNumber = `${month}${day}`

  function getLaxStats () {
    fetch(`/api`)
    .then (r => r.json())
    .then(data => {
      data.tasks.forEach(task => laxGET.push(task))
      laxGET.shift()
      groupByDate ()
      displayData ()
      loadWheel.style.display = 'none'
    })
    .catch(err => console.log(err))
  }

  function groupByDate () {
     //potentially store all the different dates in an array and access with index in 1st display data forEach
    laxGET.forEach(item => {
      const list = groupDate[item.date]
      if(list){
        list.push(item)
      } else{
        groupDate[item.date] = [item]
      }
    })
  }

  function displayData () {
    groupDate.forEach(indDate => {
      const dateGroup = document.createElement('div')
      dateGroup.classList.add('defineDate')
      indDate.forEach(stat => {
        const gameInfo = document.createElement('div')
        const awayGameInfo = document.createElement('div')
        const awayTeam = document.createElement('span')
        const awayTeamNode = document.createTextNode(stat.away_team)
        awayTeam.appendChild(awayTeamNode)
        awayGameInfo.appendChild(awayTeam)
        const awayTeamScore = document.createElement('span')
        let awayTeamScoreNode
        if (stat.away_score === '.') {
          awayTeamScoreNode = document.createTextNode('show record!!!')
        } else {
          awayTeamScoreNode = document.createTextNode(stat.away_score)
        }
        awayTeamScore.appendChild(awayTeamScoreNode)
        awayGameInfo.appendChild(awayTeamScore)
        const homeGameInfo = document.createElement('div')
        const homeTeam = document.createElement('span')
        const homeTeamNode = document.createTextNode(stat.home_team)
        homeTeam.appendChild(homeTeamNode)
        homeGameInfo.appendChild(homeTeam)
        const homeTeamScore = document.createElement('span')
        let homeTeamScoreNode
        if (stat.home_score === '.') {
          homeTeamScoreNode = document.createTextNode('show record!!!')
        } else {
          homeTeamScoreNode = document.createTextNode(stat.home_score)
        }
        homeTeamScore.appendChild(homeTeamScoreNode)
        homeGameInfo.appendChild(homeTeamScore)
        gameInfo.appendChild(awayGameInfo)
        gameInfo.appendChild(homeGameInfo)
        awayGameInfo.classList.add('gameScoreSpacing')
        homeGameInfo.classList.add('gameScoreSpacing')
        gameInfo.classList.add('gameInfo')
        dateGroup.appendChild(gameInfo)
        if (stat.date <= dayNumber) {
          pastGames.insertBefore(dateGroup, pastGames.children[1])
          if ((stat.away_score-stat.home_score) > 0) {
            gameInfo.children[0].style.fontWeight = 'bold'
          } else if ((stat.away_score-stat.home_score) < 0) {
            gameInfo.children[1].style.fontWeight = 'bold'
          }
        } else {
          futureGames.appendChild(dateGroup)
        }
      })
    })
  }

  getLaxStats ()

})();
