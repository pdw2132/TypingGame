const { handleGameStart } = require("./modules/gameStart");
const { handleGameEnd } = require("./modules/gameEnd");
const { getData } = require("./modules/getData");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom
let header
let body

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html)
    header = dom.window.document.head
    body = dom.window.document.body
  })

  it('renders a heading element', () => {
    expect(header.querySelector('title')).not.toBeNull()
  })

  it('renders a content element', () => {
    expect(body.querySelector('#content-app')).not.toBeNull()
  })

})

test('Data Send', () => {
    return getData('https://my-json-server.typicode.com/kakaopay-fe/resources/words').then(data => {
        expect(data.length).toBe(12);
        expect(data[0].text).toBe("hello");
    });
})

test('handleGameStart Test', () => {
    expect(handleGameStart.name).toBe("handleGameStart");
})

test('handleGameEnd Test', () => {
    expect(handleGameEnd.name).toBe("handleGameEnd");
})