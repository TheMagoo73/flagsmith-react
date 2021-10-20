# flagsmith-react

Flagsmith SDK for React Single Page Applications (SPA).

[![npm version](https://badge.fury.io/js/flagsmith-react.svg)](https://badge.fury.io/js/flagsmith-react)
[![Known Vulnerabilities](https://snyk.io/test/github/TheMagoo73/flagsmith-react/badge.svg)](https://snyk.io/test/github/TheMagoo73/flagsmith-react)
![CI Action](https://github.com/TheMagoo73/flagsmith-react/actions/workflows/node.js.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc670ffb64ea77e9d0e3/maintainability)](https://codeclimate.com/github/TheMagoo73/flagsmith-react/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/TheMagoo73/flagsmith-react/badge.svg?branch=main)](https://coveralls.io/github/TheMagoo73/flagsmith-react?branch=main)

## Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)

## Installation

Using [npm](https://npmjs.org)

```bash
npm install flagsmith-react
```

Using [yarn](https://yarnpkg.com)

```bash
yarn add flagsmith-react
```

## Getting Started

Configure the SDK by wrapping your application in a `FlagsmithProvider` element:

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import {FlagsmithProvider} from 'flagsmith-react';
import App from './App';

ReactDOM.render(
    <FlagsmithProvider
        environmentId="YOUR_FLAGSMITH_ENVIRONMENT_ID"
    >
        <App />
    </FlagsmithProvider>,
    document.getElementById('app')
);
```

The `Flagsmith Provider` defaults to using the vanilla JavaScript Flagsmith SDK. To support alternative SDK, for example the React Native variant, a specific provider can be supplied as a parameter, for example

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import {FlagsmithProvider} from 'flagsmith-react';
import flagsmith from 'react-native-flagsmith';
import App from './App';

ReactDOM.render(
    <FlagsmithProvider
        environmentId="YOUR_FLAGSMITH_ENVIRONMENT_ID"
        flagsmith={ flagsmith }
    >
        <App />
    </FlagsmithProvider>,
    document.getElementById('app')
);
```

Use the `useFlagsmith` hook in your components to access the Flagsmith state (`isLoading`, `isIdentified`, `isError`) and feature flag and remote configuration methods (`hasFeature`, `getValue` etc.) 


```jsx
import React from 'react';
import { useFlagsmith } from 'flagsmith-react';

function App() {
    const {
        isLoading,
        isError,
        hasFeature,
        getValue
    } = useFlagsmith();

    if (isLoading) {
        return <div>Flagsith state is loading...</div>
    }

    if (isError) {
        return <div>Failed to load Flagsmith state!</div>
    }

    const hasExtraText = hasFeature('extra_text')
    const theValue = getValue('example_value')

    return <div>
        <div>The value is {theValue}.</div>
        {
            hasExtraText && <div>Here is the extra text feature</div>
        }
    </div>
}

export default App;
```

## API Reference

> The `flagsmith-react` API is modelled on the Flagsmith Javascript integration, the documentation for which can be found [here](https://docs.flagsmith.com/clients/javascript/) for further reference.

### FlagsmithProvider

```jsx
  <FlagsmithProvider 
    environmentId
    flagsmith
    asyncStorage
    cacheFlags
    defaultFlags
    preventFetch
    api>
  </FlagsmithProvider>
```

Use the FlagsmithProvider component to wrap your application and allow child elements to access the Flagsmith functionality using the 'useFlagsmith' hook function.

### useFlagsmith

```javascript
const {
    isLoading,
    isIdentified,
    isError,
    identify,
    hasFeature,
    getValue,
    subscribe
} = useFlagsmith();
```

Use the `useFlagsmith` hook in your components to access the Flagsmith state and methods.

### isLoading: *boolean*

True if the Flagsmith state is loading, false is the state is loaded and usable. You should not try accessing the state (i.e. feature flags and remote configuration) until this is false and the state is loaded.

### isIdentified: *boolean*

True if Flagsmith has been configured to use a specific identity when resolving flags and remote configuration, false otherwise.

See [identify](#identify) for more information.

### isListening: *boolean*

True if Flagsmith is configured to listen for updates. See [startListening](#startListening) for more details.

### isError: *boolean*

True if the Flagsmith integration is in an errored state (e.g. the server could not be reached). False otherwise.

### identify

```javascript
await identify(identity)
```

Passes the supplied identity to the Flagsmith backend to be used when resolving feature flags and remote configuration. This causes an update in the state, which is an async action. Use the [isIdentified](#isIdentified) flag to determine when the state has been re-loaded, or use [subscribe](#subscribe) to receive an update notification.

### logout

```javascript
await logout()
```

Remove any identity associated with the Flagsmith client. Use the [isIdentified](#isIdentified) flag to determine when the state has been re-loaded, or use [subscribe](#subscribe) to receive an update notification.

### hasFeature

```javascript
hasFeature(key)
```

Determines is the feature specified `key` is set or not.

### getValue

```javascript
getValue(key)
```

Gets the current value of the remote configuration item specified by the `key`.

### startListening

```javascript
startListening(interval = 1000)
```
Begin listening for backend configuration changes. The polling interval is specified in mS. Use [isListening](#isListening) to determine the current listening state, and [subscribe](#subscribe) to be notified of updates.

### stopListening

```javascript
stopListening()
```
Stop listening (polling) for configuration changes.

### subscribe

```javascript
subscribe(callback)
```

Registers a callback with Flagsmith that will be triggered any time a new configuration is available, for example after loading is complete, or when a new user is identified. This can be used to update any configuration state in components using Flagsmith, per the following example.

```javascript
import { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';
import { useFlagsmith } from 'flagsmith-react'

function App() {
  const { isLoading, isError, getValue, identify, subscribe } = useFlagsmith()
  const [val, setVal] = useState()

  useEffect(() => {
    if(!isLoading) {
      identify('someone@somewhere.com')
    }
  }, [isLoading, identify])

  const handleChange = () => {
    setVal( getValue('val') )
  }

  subscribe(handleChange)

  return (
    <>
      {
        !isLoading &&
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {
              isError && <h3>Flagsmith failed to load</h3>
            }
            {
              val && <h1>{val}</h1>
            }
          </header>
        </div>
      }
    </>
  );
}

export default App;
```

### getFlags

```javascript
await getFlags()
```

Forces a fetch of the current flags.

### getTrait

```javascript
getTrait(key)
```

Can only be used once a user has been identified, to get the value of the specified trait for that user.

### setTrait

```javascript
await setTrait(key, value)
```

Can only be used once a user has been identified, to set the value of the specified trait for that user.

### setTraits

```javascript
await setTraits(traits)
```

Can only be used once a user has been identified, to set the value of the multiple traits for that user. Traits set to a value of `null` will be removed.

### incrementTrait

```javascript
await incrementTrait(key, incrementBy)
```

Can only be used once a user has been identified, used to increment (or decrement) the specified trait for that user.
