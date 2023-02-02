import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

let Parser = require("rss-parser");
let parser = new Parser();

(async () => {
  let feed = await parser.parseURL("https://www.reddit.com/.rss");
  console.log(feed.title);

  feed.items.forEach((item) => {
    console.log(item.title + ":" + item.link);
  });
})();

const url = "https://rss.art19.com/apology-line";
let headers = new Headers();
headers.append("Access-Control-Allow-Origin", "http://localhost:3000");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { news: [] };
  }

  componentDidMount() {
    this.getNews();
  }

  async getNews() {
    const text = await fetch(url, {
      //mode: 'no-cors',
      // credentials: 'include',
      method: "GET",
      headers: headers,
    })
      .then((r) => r.text())
      .catch((err) => console.log(err));
    const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
    const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => ({
      title: item.querySelector("title").textContent,
      description: item.querySelector("description").childNodes[0].data,
    }));
    this.setState({ news: items });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">News</h1>
        </header>
        <div className="App-feeds" />
        <div className="panel-list">
          {this.state.news.length === 0 && <p>Loading...</p>}
          {this.state.news.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
              <hr />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
