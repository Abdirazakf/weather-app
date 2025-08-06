import "./styles/reset.css"
import "./styles/style.css"

import WeatherData from "./modules/weatherdata"

const data = new WeatherData

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await data.init()
    } catch (err){
        console.log(err)
    }
})