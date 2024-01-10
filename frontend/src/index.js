import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import ThemeProviderComponent from './components/ThemeProviderComponent';


import { BrowserRouter as Router } from 'react-router-dom'

import store from './store'


ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Provider store={store}>
      <ThemeProviderComponent>

            <App />
        </ThemeProviderComponent>

        </Provider>
    </Router>
)
