/* eslint-disable no-undef */
import React, {useEffect, useState} from "react";
import Loader from "./components/Loader";
import './App.css'

function App() {
    const [state, setState] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function loadClient() {
        gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
        return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");
    }

    function authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"});
    }

    function execute() {
        return gapi.client.youtube.subscriptions.list({
            "part": [
                "snippet"
            ],
            "mine": true,
            "maxResults": 50,
        }).then(setState);
    }

    function loadApi() {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        script.onload = () => {
            gapi.load('client:auth2', function () {
                gapi.auth2.init({client_id: process.env.REACT_APP_CLIENT_ID});
            });
        }
    }

    const handleAuth = () => {
        setIsLoading(true);
        authenticate()
            .then(loadClient)
            .then(_ => {
                setIsAuthenticated(true);
                execute();
                setIsLoading(false);
            });
    }

    useEffect(() => {
        loadApi();
    }, []);
    useEffect(() => {
        console.info('Current state:', state ? state.result.items : state);
    }, [state]);
    return (
        <div className="App">
            <header>
                <div className="app-title-wrapper">
                    <h1 className="app-title">YT sub manager</h1>
                    <h2 className="app-user">load user email here -- also date data was last updated</h2>
                </div>
                <ul className="header-todo-list">
                    <li>Images should have skeleton placeholders that are dismissed on load.</li>
                    <li>Save user actions in Firebase (after successful completion of action).</li>
                    <li>On initial load, fetch user records (video list, favorites, etc) from Firebase. If more than 1
                        day old, ask Youtube instead
                    </li>
                    <li>Allow *undo* action.</li>
                    <li>Optimistic UI (deletion, archival, favorite).</li>
                    <li>Implement Pagination (response has nextPageToken).</li>
                    <li>BUG: horizontal scrolling.</li>
                    <li>BUG: go to bottom button not working.</li>
                </ul>
            </header>
            <main>
                {
                    isLoading && <Loader/>
                }
                {state && (
                    <section className="main--channels-wrapper">
                        {
                            state.result.items.map(e => <ChannelEntry key={e.id} entry={e}/>)
                        }
                    </section>
                )}
                {!isLoading && !isAuthenticated && (
                    <button disabled={isAuthenticated ? true : false} onClick={handleAuth}>auth</button>)}
                    <div id="hidden-target">...</div>
            </main>
            <footer>
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Back to top</button>
                {/*<button onClick={() => window.scrollTo({bottom: 0, left: 0, behavior: 'smooth'})}>Jump to bottom</button>*/}
                <a href="#hidden-target">Bottom target</a>
            </footer>
        </div>
    );
}

const ChannelEntry = ({entry}) => {
    return (
        <article className="card-root">
            <img className="card-image" height="88px" width="88px" src={entry.snippet.thumbnails.default.url}
                 alt={entry.snippet.title}/>
            <div className="channel-description-wrapper">
                <b className="card-title">{entry.snippet.title}</b>
                <small className="channel-id" title={entry.id}>{entry.id}</small>
            </div>
            <div className="controls-row">
                <button onFocus={(e) => {
                    e.target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                }}>Delete</button>
                <select name="other-channels" id="other-channels" disabled={true}>
                    <option value="" defaultValue={true} disabled={true} hidden={true}>Move to another channel</option>
                    <option value="channel-b">Channel B</option>
                    <option value="channel-c">Channel C</option>
                    <option value="channel-d">Channel D</option>
                </select>
                <button disabled={true}>Favorite</button>
                <button disabled={true} title="(don't show again in this app)">Archive</button>
            </div>
        </article>
    )
}

export default App;
