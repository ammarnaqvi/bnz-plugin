import logo from './logo.svg';
import './App.css';
import * as ReactDOM from 'react-dom';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Alert
} from 'antd';
import bnzSdk from 'bnzapimatic';
import { Base64 as base64 } from 'js-base64';

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
  scriptTag.src = url;

  scriptTag.onload = callback;
  scriptTag.onerror = () => {
    throw new Error('APIMatic: Failed to load ' + url);
  };

  document.getElementsByTagName('head')[0].appendChild(scriptTag);
}

window.BNZPlugin = bNZPluginInterface;




function App() {

  const [OAuthClientId, setOAuthClientId] = useState("1U5hCE3h3AhCJXGNgOstGp6drkaMxB4S")
  const [OAuthClientSecret, setOAuthClientSecret] = useState("fpiG05c6tEjwkPmr")
  const [OAuthRedirectUri, setOAuthRedirectUri] = useState('https://apimatic-proxy.azurewebsites.net/oauth2_callback')
  const [isAuthorized, setIsAuthorized] = useState(false);

  let state = `https://apimatic-proxy.azurewebsites.net/oauth2_callback;${OAuthClientId};${OAuthClientSecret};https://secure.sandbox.bnz.co.nz/pingfederate/as/token.oauth2;${window.location.origin}`;

  let authorizeClient = () => {
    console.log('hello')
    const configuration = bnzSdk.Configuration;

    const oAuthManager = bnzSdk.OAuthManager;
    configuration.oAuthClientId = OAuthClientId;
    configuration.oAuthClientSecret = OAuthClientSecret;
    configuration.oAuthRedirectUri = OAuthRedirectUri;

    let authUrl = oAuthManager.buildAuthorizationUrl([bnzSdk.OAuthScopeEnum.BANKFEEDS], state);

    let promise = new Promise(
      (resolve, reject) => {
        const newWindow = window.open(authUrl);
        if (newWindow === null) {
          reject();
          return;
        }
        window.addEventListener(
          'message',
          event => {
            if (
              event.origin ===
              new URL(
                OAuthRedirectUri
              ).origin
            ) {
              // resolved = true;
              const decodedBody = base64.decode(event.data.RawContent);
              resolve(JSON.parse(decodedBody));
            }
          },
          false
        );
      }
    );

    let authTokenPromise = bnzSdk.OAuthManager.setOAuthToken(promise);
    authTokenPromise.then(resp => {
      console.log(bnzSdk.OAuthManager.isTokenSet());
      setIsAuthorized(bnzSdk.OAuthManager.isTokenSet());
    }).catch(err => {
      console.log(err);
    })

    // let code = 'GRJ0_1a5MPwQsFW4NdkLNTFZiwtMyQ4Io5AAABkh';
    // const tokenPromise = oAuthManager.authorize(code);
    // tokenPromise.then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.log(err);
    // })


  }

  let getV3Accounts = () => {
    let account = bnzSdk.MiscController.gETv3Accounts('VD9ww2IxRnUWtTUYipeDx33GUTYHJRpn');

    account.then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        {isAuthorized && <Alert message="Authorized Successfully" type="success" showIcon />}

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
            <Button onClick={authorizeClient}>Submit</Button>
          </Form.Item>
          {isAuthorized && <p>Authorized Successfully</p>}
        </Form>

        <h2>Get Account</h2>
        <Button type="primary" onClick={getV3Accounts}>Get V3 Account</Button>


      </header>
    </div>
  );
}

export default App;
