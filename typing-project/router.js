// template
const gameStartTemplate = require('./pages/gameStart.hbs')
const gameEndTemplate = require('./pages/gameEnd.hbs')

const GameStart = gameStartTemplate()
const GameEnd = gameEndTemplate()

const routes = {
  '/': GameStart,
  '/gameStart': GameStart,
  '/gameEnd': GameEnd
}

// entry point
function initialRoutes (mode, el) {
  renderHTML(el, routes['/'])

  if (mode === 'history') {
    window.onpopstate = () => renderHTML(el, routes[window.location.pathname])
  }
}

// set browser history
function historyRouterPush (pathName, el) {
  window.history.pushState({}, pathName, window.location.origin + pathName)
  renderHTML(el, routes[pathName])
}

// render
function renderHTML (el, route) {
  el.innerHTML = route
}

module.exports = {
  initialRoutes,
  historyRouterPush
}
