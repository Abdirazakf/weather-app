export default class WeatherData {
    constructor() {
        this.weatherData = null
        this.daysData = null
        this.currentDate = null
        this.currentTemp = null
        this.currentCondition = null
        this.isLoaded = false
    }

    async getData(){
        try {
            const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/atlanta?key=292MCQGT7NMZ6WDTLJE6UDWLQ&include=days,current", {
                mode: 'cors'
            })
            
            let data = await response.json()
            
            this.weatherData = data
            this.daysData = data.days
            this.currentDate = data.days[0]
            this.currentCondition = data.currentConditions.conditions
            this.currentTemp = data.currentConditions.temp
            this.isLoaded = true
            
            return {
                weatherData: this.weatherData,
                daysData: this.daysData,
                currentDate: this.currentDate,
                currentTemp: this.currentTemp,
                currentCondition: this.currentCondition
            }
        } catch(err) {
            console.log(err)
        }
    }

    checkData() {
        if (!this.isLoaded) {
            throw new Error('Weather data not loaded yet');
        }

        console.log(this.weatherData)
    }

    async init() {
        await this.getData()
        this.checkData()
    }
}
        