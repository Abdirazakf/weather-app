export default class WeatherData {
    constructor() {
        this.weatherData = null
        this.daysData = null
        this.currentDate = null
        this.currentTemp = null
        this.currentCondition = null
        this.isLoaded = false
        this.isToggled = false
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
        const card = document.querySelector('.day-1')

        try {
            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.search}?key=NBLD24MKAWZY9998RU27GLF7W&include=days,current`, {
                mode: 'cors'
            })
            
            let data = await response.json()
            
            this.weatherData = data
            this.daysData = data.days
            this.currentDate = data.days[0]
            this.currentCondition = data.currentConditions.conditions
            this.currentTemp = data.currentConditions.temp
            this.isLoaded = true

            this.displayCurrentData()

            if (card) {
                this.displayWeekly()
            }
            
            return {
                weatherData: this.weatherData,
                daysData: this.daysData,
                currentDate: this.currentDate,
                currentTemp: this.currentTemp,
                currentCondition: this.currentCondition
            }
        } catch(err) {
            console.log(err)
            alert('Error: Unable to find location')
        }
    }

    checkData() {
        if (!this.isLoaded) {
            throw new Error('Weather data not loaded yet');
        } else {
            console.log(this.daysData)
            console.log(this.currentDate)
            console.log(this.currentTemp)
            console.log(this.currentCondition)
        }
    }

    displayCurrentData(){
        const header = document.querySelector('.location')
        header.textContent = this.search
        const temp = document.querySelector('.today > .temp')
        const degreeSymbol = document.createElement('sup')
        degreeSymbol.innerHTML = '&deg;'

        if (!this.isToggled){
            temp.textContent = ((this.currentTemp - 32)/ (9/5)).toFixed(1)
        } else {
            temp.textContent = this.currentTemp
        }
        
        temp.appendChild(degreeSymbol)
        const conditions = document.querySelector('.condition')
        conditions.textContent = this.currentCondition
    }

    createWeeklyCards() {
        const container = document.querySelector('.container')
        for (let i = 1; i < 7; i++){
            const card = document.createElement('div')
            card.className = `day-${i} card`

            const temp = document.createElement('h1')
            temp.className = 'temp'

            const condition = document.createElement('h2')
            condition.className = 'condition'

            card.appendChild(temp)
            card.appendChild(condition)
            container.appendChild(card)
        }
    }

    displayWeekly() {
        for (let i = 1; i < 7; i++){
            const card = document.querySelector(`.day-${i}`)

            const temp = card.querySelector('.temp')

            if (!this.isToggled){
                temp.textContent = ((this.daysData[i].temp -32)/ (9/5)).toFixed(1)
            } else {
                temp.textContent = this.daysData[i].temp
            }

            const degreeSymbol = document.createElement('sup')
            degreeSymbol.innerHTML = '&deg;'
            temp.appendChild(degreeSymbol)
    
            const condition = card.querySelector('.condition')
            condition.textContent = this.daysData[i].conditions
        }
    }

    checkDegree() {
        const degreeButton = document.querySelector('input[type="checkbox"]')

        degreeButton.addEventListener('click', () => {
            if (!this.isToggled){
                this.isToggled = true
            } else {
                this.isToggled = false
            }
            
            this.displayCurrentData()
            this.displayWeekly()
        })

        return this.isToggled
    }

    async init() {
        this.getSearchResult()
        await this.getData()
        this.createWeeklyCards()
        this.displayCurrentData()
        this.displayWeekly()
        this.checkDegree()
    }
}