import logo from './logo.svg';
import './App.css';
import * as ReactDOM from 'react-dom';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
} from 'antd';

// const bnzSdk = require('APIMatic+Ltd+Bank+Feeds+Sandbox-NodeJs');


const POLYFILL_URL =
    // tslint:disable-next-line:max-line-length
    'https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.find,Array.prototype.findIndex,Array.prototype.@@iterator&excludes=Promise,fetch';

const bNZPluginInterface = {
    // tslint:disable-next-line:no-any
    show(settings) {
        loadScript(POLYFILL_URL, () => {
            localStorage.setItem('portalEditorSettings', JSON.stringify(settings));
            ReactDOM.render(
                <App settings={settings} />,
                document.getElementById('root')
            );
        });
    },
};

function loadScript(url, callback) {
  const scriptTag = document.createElement('script');
  scriptTag.async = true;
  scriptTag.onload = callback;
  scriptTag.src = url;
  
  scriptTag.onerror = () => {
      throw new Error('APIMatic: Failed to load ' + url);
  };

  document.head.appendChild(scriptTag);
}

window.BNZPlugin = bNZPluginInterface;




function App () {

  const [OAuthClientId, setOAuthClientId] = useState("OAuthClientId")
  const [OAuthClientSecret, setOAuthClientSecret] = useState("OAuthClientSecret")
  const [OAuthRedirectUri, setOAuthRedirectUri] = useState("OAuthRedirectUri")

  // const configuration = bnzSdk.Configuration;

  // const oAuthManager = bnzSdk.OAuthManager;
  // configuration.oAuthClientId = 'OAuthClientId';
  // configuration.oAuthClientSecret = 'OAuthClientSecret';
  // configuration.oAuthRedirectUri = 'OAuthRedirectUri';

  // const authUrl = oAuthManager.buildAuthorizationUrl([bnzSdk.OAuthScopeEnum.BANKFEEDS]);


  return (
    <div className="App">
      <header className="App-header">
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 6,
        }}
        layout="horizontal"
        size="large"
      >
        <Form.Item label="OAuthClientId">
          <Input value={OAuthClientId} onChange={(e) => setOAuthClientId(e.target.value)} />
        </Form.Item>
        <Form.Item label="OAuthClientSecret">
        <Input value={OAuthClientSecret} onChange={(e) => setOAuthClientSecret(e.target.value)} />
        </Form.Item>
        <Form.Item label="OAuthRedirectUri">
        <Input value={OAuthRedirectUri} onChange={(e) => setOAuthRedirectUri(e.target.value)} />
        </Form.Item>
        <Form.Item label="Button">
          <Button>Submit</Button>
        </Form.Item>
      </Form>
      </header>
    </div>
  );
}

export default App;
