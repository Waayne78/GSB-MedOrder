import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from "./App.jsx"
import store from "./store"
import "./styles/variables.css"
import "./styles/global.css"
import "./styles/main.css"
import "./styles/App.css"
import "./styles/navbar.css"
import "./styles/MedicationCard.css"
import "./styles/PractitionerCard.css"
import "./styles/Home.css"
import "./styles/Auth.css"
import "./styles/Contact.css"
import "./styles/MedicationCatalog.css"
import "./styles/MedicationDetails.css"
import "./styles/PractitionerProfile.css"
import "./styles/Cart.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)