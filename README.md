# flagsmith-react

Flagsmith SDK for React Single Page Applications (SPA).

> This project is currently in Alpha development. It exposes a limited subset of the core Flagsmith SDK and is missing a number of 'production' elements such as better error handling, tests etc.

## Contents
- [Installation](#installation)
- [Getting Started](#getting-started)

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