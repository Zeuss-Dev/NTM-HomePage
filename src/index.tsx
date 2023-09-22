import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();
var fechacompleta = "A data de hoje é "+dia+"/"+mes+"/"+ano;
document.getElementById('dateTime').innerHTML = fechacompleta;
document.getElementById('currentYear').innerHTML = ano;
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
