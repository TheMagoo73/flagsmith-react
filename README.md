# flagsmith-react

Flagsmith SDK for React Single Page Applications (SPA).

> This project is currently in Alpha development. It exposes a limited subset of the core Flagsmith SDK and is missing a number of 'production' elements such as better error handling, tests etc.

[![npm version](https://badge.fury.io/js/flagsmith-react.svg)](https://badge.fury.io/js/flagsmith-react)

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
import {FlagsmithProvdider} from 'flagsmith-react';
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

True if the Flagsmith state is loading, false is the state is loaded and useable. You should not try accessing the state (i.e. feature flags and remote configuration) until this is false and the state is loaded.

### isIdentified: *boolean*

True if Flagsmith has been configured to use a specific identity when resolving flags and remote configuration, false otherwise.

See [identify](#identify) for more information.

### isError: *boolean*

True if the Flagsmith integration is in an errored state (e.g. the server could not be reached). False otherwise.

### identify

```javascript
await identify(identity)
```

Passes the supplied identity to the Flagsmith backend to be used when resolving feature flags and remote configuration. This causes an update in the state, which is an async action. Use the [isIdentified](isIdentified) flag to determine when the state has been re-loaded.

### hasFeature

```javascript
hasFeature(key)
```

Determines is the feature specified `key` is set or not.

### getValue

```
getValue(key)
```

Gets the current value of the remote configuration item specified by the `key`.

### subscribe(callback)

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