export default class WeatherData {
    constructor() {
        this.weatherData = null
        this.daysData = null
        this.currentDate = null
        this.currentTemp = null
        this.currentCondition = null
        this.isLoaded = false
        this.search = 'New York'
    }

    getSearchResult() {
        const form = document.querySelector('form')
        const searchResult = form.querySelector('input')
        const locationHeader = document.querySelector('.location')

        form.addEventListener('submit', async (event) => {
            event.preventDefault()

            if (searchResult.value){
                this.search = searchResult.value
            }

            await this.getData()
            locationHeader.textContent = this.weatherData.resolvedAddress.charAt(0).toUpperCase() + this.weatherData.resolvedAddress.slice(1)
            form.reset()
        })

        return this.search
    }

    async getData(){
        this.getSearchResult()

        try {
            console.log(this.search)
            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.search}?key=292MCQGT7NMZ6WDTLJE6UDWLQ&include=days,current`, {
                mode: 'cors'
            })
            
            let data = await response.json()
            
            this.weatherData = data
            this.daysData = data.days
            this.currentDate = data.days[0]
            this.currentCondition = data.currentConditions.conditions
            this.currentTemp = data.currentConditions.temp
            this.isLoaded = true

            this.checkData()
            
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
        } else {
            console.log(this.weatherData)
            console.log(this.daysData)
            console.log(this.currentDate)
            console.log(this.currentTemp)
            console.log(this.currentCondition)
        }
    }

    displayCurrentData(){
        const header = document.querySelector('.location')
        header.textContent = this.search
    }

    async init() {
        this.getSearchResult()
        await this.getData()
        this.displayCurrentData()
    }
}