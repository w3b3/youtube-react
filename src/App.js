/* eslint-disable no-undef */
import React, {useEffect, useState} from "react";

function App() {
    const [state, setState] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    function authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"}).then(_ => setIsAuthenticated(true));
    }

    function loadClient() {
        gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
        return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");
    }

    function execute() {
        return gapi.client.youtube.subscriptions.list({
            "part": [
                "snippet"
            ],
            "mine": true
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
        authenticate().then(loadClient);
    }

    useEffect(() => {
        loadApi();
    }, []);
    useEffect(() => {
        console.info(state ? state.result.items : 'nothing yet');
    }, [state]);
    return (
        <div className="App">
            <h1>Youtube app</h1>
            {state && state.result.items.map(e => <article key={e.id}>{e.id}</article>)}
            <button disabled={!isAuthenticated ? false : true} onClick={handleAuth}>auth</button>
            <button disabled={isAuthenticated ? false : true} onClick={execute}>execute</button>
        </div>
    );
}

export default App;
