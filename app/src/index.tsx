import { BrowserRouter } from 'react-router-dom'
import { ColorModeScript } from '@chakra-ui/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client'

import { apolloClient } from 'utils/graphql'
import { App } from 'containers/App/App'
import * as serviceWorker from './serviceWorker'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <React.StrictMode>
            <BrowserRouter>
                <ColorModeScript />
                <App />
            </BrowserRouter>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
