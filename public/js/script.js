'use strict';
(() => {
  const loadWheel = document.querySelector('.loadWheel')
  const pastGames = document.querySelector('.pastGames')
  const futureGames = document.querySelector('.futureGames')
  const pastAndFuture = [pastGames, futureGames]

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
  // need better system here for year
  const year = '2017'
  let fullGameDate
  const pastButton = document.createElement('BUTTON')
  const futureButton = document.createElement('BUTTON')
  let pastGamesButton = true
  let futureGamesButton = true
  let howMuchShow = 7

  function getLaxStats () {
    fetch(`/api`)
    .then (r => r.json())
    .then(data => {
      data.tasks.forEach(task => laxGET.push(task))
      laxGET.shift()
      groupByDate ()
      const pastColumnTitle = document.createElement('H1')
      const pastTitle = document.createTextNode('Recent')
      pastColumnTitle.appendChild(pastTitle)
      pastGames.appendChild(pastColumnTitle)
      const FutureColumnTitle = document.createElement('H1')
      const futureTitle = document.createTextNode('Upcoming')
      FutureColumnTitle.appendChild(futureTitle)
      futureGames.appendChild(FutureColumnTitle)
      displayData ()
      const buttonNodeFuture = document.createTextNode('View All')
      const buttonNodePast = document.createTextNode('View All')
      pastButton.appendChild(buttonNodePast)
      futureButton.appendChild(buttonNodeFuture)
      pastGames.appendChild(pastButton)
      futureGames.appendChild(futureButton)
      pastGames.querySelector('BUTTON').addEventListener('click', ()=> {
        pastGamesButton = !pastGamesButton
        howManyToShow (pastGames)
        pastButton.innerHTML = (pastGamesButton ? 'View All' : 'Show Less')
      })
      futureGames.querySelector('BUTTON').addEventListener('click', ()=> {
        futureGamesButton = !futureGamesButton
        howManyToShow (futureGames)
        futureButton.innerHTML = (futureGamesButton ? 'View All' : 'Show Less')
      })
      loadWheel.style.display = 'none'
    })
    .catch(err => console.log(err))
  }

  function groupByDate () {
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
    groupDate.forEach((indDate,i) => {
      const dateGroup = document.createElement('div')
      dateGroup.classList.add('defineDate')
      const dateGroupDate = document.createElement('h2')
      numberIntoDate (i)
      const dateGroupDateNode = document.createTextNode(fullGameDate)
      dateGroupDate.appendChild(dateGroupDateNode)
      dateGroup.appendChild(dateGroupDate)
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
    ifNoUpcoming ()
    howManyToShow (pastAndFuture)
  }

  function numberIntoDate (num) {
    const dayOfGame = (num.toString()).slice(-2)
    const monthOfGame = (num.toString()).slice(0, -2)
    const months = ['dummy', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const stringMonthOfGame = months[monthOfGame]
    const weekdayEntryInfo = `${dayOfGame} ${stringMonthOfGame}, ${year}`
    const daysInWeek= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    const eventDate = new Date(eval('weekdayEntryInfo'))
    const dayOfWeek = daysInWeek[eventDate.getDay()]
    fullGameDate = `${dayOfWeek}, ${stringMonthOfGame} ${dayOfGame}, ${year}`
  }

  function howManyToShow (showWhich) {
    if (showWhich.length > 1) {
      showWhich.forEach(game => {
        showThatMany (game)
      })
    } else {
      showThatMany (showWhich)
    }
  }

  function showThatMany (game) {
    const arrayOfGameDays = Array.prototype.slice.call(game.children)
    arrayOfGameDays.shift()
    let arrayOfGames = []
    arrayOfGameDays.forEach(day => {
      const eachDayGames = Array.prototype.slice.call(day.children)
      eachDayGames.forEach(indGame => {
        arrayOfGames.push(indGame)
      })
    })
    if (eval(`${game.className}Button`) == true) {
      for (let d = howMuchShow; d < arrayOfGames.length; d++) {
        arrayOfGames[d].style.display = 'none'
      }
      if (arrayOfGames[howMuchShow-1].tagName === 'H2') {
        arrayOfGames[howMuchShow-1].style.display = 'none'
      }
    } else {
      for (let d = howMuchShow; d < arrayOfGames.length; d++) {
        arrayOfGames[d].style.display = 'block'
      }
    }
  }

  function ifNoUpcoming () {
    const noGameMessage = ['No Recent Games', 'No Upcoming Games']
    pastAndFuture.forEach((game,i) => {
      if ((game.childNodes.length) <= 1) {
        const noGames = document.createElement('h3')
        const noGamesNode = document.createTextNode(noGameMessage[i])
        noGames.appendChild(noGamesNode)
        game.appendChild(noGames)
      }
    })
  }

  getLaxStats ()

})();
