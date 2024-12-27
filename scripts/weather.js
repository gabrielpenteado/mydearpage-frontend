// SELECT ELEMENTS
const local = document.querySelector('.local');
const inputCityName = document.querySelector('.inputCityName');
const todayIcon = document.querySelector('.todayIcon');
const todayTemperature = document.querySelector('.todayTemperature');
const todayDegree = document.querySelector('.todayTemperature p span');
const todayInformations = document.querySelector('.todayTemperature h3 span');
const nextDays = document.querySelector('.nextDays');
const searchIcon = document.querySelector('.fa-search');
const spinIcon = document.querySelector('.fa-circle-notch');
const alertPopUp = document.querySelector('.alertPopUp');
const alertMessage = document.querySelector('.alertPopUp span');
const alertClose = document.querySelector('.alertPopUp a');
const alertIconWeather = document.querySelector('.fa-exclamation-circle');
const freezePageWeather = document.querySelectorAll('.freezeWithAlert');

// DAYS OF WEEK ARRAY
const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// FUNCTION CLEAR INPUT CITY AND TURN OFF LOADING SPIN
const resetCity = () => {
    inputCityName.value = '';
    searchIcon.classList.remove("fas", "fa-circle-notch", "fa-spin");
    searchIcon.classList.add("fa", "fa-search");
};

// FUNCTION TO CHECK AND CHANGE ALERT POP-UP WEATHER ICON
const alertPopUpIconChange = () => {
    if (!alertIconWeather.classList.contains('fa-exclamation-circle')) {
        alertIconWeather.classList.add('fa-exclamation-circle');
        alertIconWeather.classList.remove('fa-hand-paper');
    }
};

// FUNCTION TO FREEZE BACKGROUND WITH ALERT POP-UP
const freezePage2 = () => {
    freezePageWeather.forEach(item => {
        item.style.pointerEvents = 'none';
    })
}
// FUNCTION TO UNFREEZE BACKGROUND WITH ALERT POP-UP
const unfreezePage2 = () => {
    freezePageWeather.forEach(item => {
        item.style.pointerEvents = 'auto';
    })
}

// WEATHER DISPLAY ANIMATION
const animationIn = () => {
    todayIcon.style.animation = 'weatherAnimation 700ms ease-in';
    todayTemperature.style.animation = 'weatherAnimation 700ms ease-in';
    nextDays.style.animation = 'weatherAnimation 700ms ease-in';
}
const animationOut = () => {
    todayIcon.style.animation = '';
    todayTemperature.style.animation = '';
    nextDays.style.animation = '';
}

// CHECK IF BROWSER SUPPORT GEOLOCATION AND GET IT WHEN PAGE LOADS,
// IF NOT, DISPLAY MESSAGE TO USER TYPE CITY NAME. 
window.addEventListener('load', () => {
    // SPIN LOADING ON
    searchIcon.classList.remove("fa", "fa-search");
    searchIcon.classList.add("fas", "fa-circle-notch", "fa-spin");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getTodayWeather, displayError);
    } else {
        alert("Geolocation is not supported.");
    }
})

// FUNCTION WEATHER ON LOAD
const getTodayWeather = async (position) => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    const coord = {
        lat: lat,
        lon: lon
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(coord)
    };

    const response = await fetch('/onload', options);
    const data = await response.json();
    // console.log(data);

    async function getLocation(lat, lon) {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`);
            const data = await response.json();

            const city = data.city;
            const country = data.countryCode;

            return { city, country };

        } catch (error) {
            console.error('Erro ao obter dados de geolocalização:', error);
        }
    }

    const localization = await getLocation(lat, lon);

    // HANDLE REQUEST ERRORS
    if (data.cod === '404' || data.cod === '400') {
        alertPopUpIconChange();

        alertPopUp.style.display = 'flex';
        alertMessage.innerHTML = `<h1>${data.cod} - ${data.message}.
         Please, type city name.</h1>`;

        freezePage2();
        resetCity();

        alertClose.addEventListener('click', () => {
            alertPopUp.style.display = 'none';
            unfreezePage2();
        })
    }

    const now = new Date();
    const hour = now.getHours();

    const { weatherCode, temperature2m, relativeHumidity2m } = data.today;

    const todayData = {
        hour: hour,
        temperature: Math.round(temperature2m),
        humidity: Math.round(relativeHumidity2m),
        weatherCode: weatherCode
    };

    const selectIcon = (weatherCode, hour) => {

        if (weatherCode === 0 && hour < 18) {
            return "01d";
        } else if (weatherCode === 0 && hour >= 18) {
            return "01n";
        } else if (weatherCode === 45 || weatherCode === 48) {
            return "50d";
        } else if (weatherCode >= 50 && weatherCode <= 60) {
            return "09n";
        } else if ((weatherCode === 1 || weatherCode === 2 || weatherCode === 3) && hour < 18) {
            return "03d";
        } else if ((weatherCode === 1 || weatherCode === 2 || weatherCode === 3) && hour >= 18) {
            return "03n";
        } else if ((weatherCode >= 70 && weatherCode <= 79) || weatherCode === 85 || weatherCode === 86) {
            return "13n";
        } else if ((weatherCode >= 60 && weatherCode <= 69) || (weatherCode >= 80 && weatherCode <= 82)) {
            return "10n";
        } else if (weatherCode >= 95 && weatherCode <= 99) {
            return "11n";
        } else {
            return "unknown";
        }
    };


    // SPIN LOADING OFF
    searchIcon.classList.remove("fas", "fa-circle-notch", "fa-spin");
    searchIcon.classList.add("fa", "fa-search");

    // DISPLAY WEATHER TODAY
    // console.log(localization);
    animationIn();
    local.textContent = `${localization.city} - ${localization.country}`;
    todayDegree.textContent = todayData.temperature;
    todayInformations.textContent = todayData.humidity;
    todayIcon.innerHTML = `<img src="/assets/weather-icons/${selectIcon(todayData.weatherCode, todayData.hour)}.svg" alt="todayicon">`;

    // GET MAX AND MIN TEMP FROM NEXT DAYS
    // console.log(data.nextDays);

    const arrMaxMin = data.nextDays.map((item, index) => `
      <div>
        <p class="dayOfWeek">${weekDay[item.dayOfWeek]}</p>
        <div class="nextDayIcon${index}">
            <img src="/assets/weather-icons/${selectIcon(item.weatherCode, 0)}.svg" alt = "nextdaysicons">
        </div >
        <div class="maxmin">
            <i class="fas fa-arrows-alt-v"></i>
            <div>
                <p class="max"><span>${Math.round(item.tempMax)}°C</span></p>
                <p class="min"><span>${Math.round(item.tempMin)}°C</span></p>
            </div>
        </div> 
      </div >
    `).slice(0, 6).join('');
    // console.log(arrMaxMin)

    //DISPLAY WEATHER OF NEXT DAYS
    nextDays.innerHTML = arrMaxMin;
};


// FUNCTION WEATHER BY TYPING CITY NAME
const getWeatherByCityName = async (event) => {
    if (event.key === "Enter" || event.type === 'click') {

        animationOut();
        // SPIN LOADING ON
        searchIcon.classList.remove("fa", "fa-search");
        searchIcon.classList.add("fas", "fa-circle-notch", "fa-spin");

        const cityNamecountryCode = {
            q: inputCityName.value
        };
        // console.log(cityNamecountryCode);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cityNamecountryCode)
        };
        const response = await fetch('/cityname', options);
        const data = await response.json();
        // console.log(data);

        // HANDLE REQUEST ERRORS
        if (data.cod === '404' || data.cod === '400') {
            alertPopUpIconChange();

            alertPopUp.style.display = 'flex';
            alertMessage.innerHTML = `< h1 > ${data.cod} - ${data.message}.
Please, type city name again.</h1 > `;

            freezePage2();
            resetCity();

            alertClose.addEventListener('click', () => {
                alertPopUp.style.display = 'none';
                unfreezePage2();
            })
        }

        const now = new Date();
        const hour = now.getHours();

        const { weatherCode, temperature2m, relativeHumidity2m } = data.today;

        const todayData = {
            hour: hour,
            temperature: Math.round(temperature2m),
            humidity: Math.round(relativeHumidity2m),
            weatherCode: weatherCode
        };
        // console.log(todayData);

        const selectIcon = (weatherCode, hour) => {

            if (weatherCode === 0 && hour < 18) {
                return "01d";
            } else if (weatherCode === 0 && hour >= 18) {
                return "01n";
            } else if (weatherCode === 45 || weatherCode === 48) {
                return "50d";
            } else if (weatherCode >= 50 && weatherCode <= 60) {
                return "09n";
            } else if ((weatherCode === 1 || weatherCode === 2 || weatherCode === 3) && hour < 18) {
                return "03d";
            } else if ((weatherCode === 1 || weatherCode === 2 || weatherCode === 3) && hour >= 18) {
                return "03n";
            } else if ((weatherCode >= 70 && weatherCode <= 79) || weatherCode === 85 || weatherCode === 86) {
                return "13n";
            } else if ((weatherCode >= 60 && weatherCode <= 69) || (weatherCode >= 80 && weatherCode <= 82)) {
                return "10n";
            } else if (weatherCode >= 95 && weatherCode <= 99) {
                return "11n";
            } else {
                return "unknown";
            }
        };

        // SPIN LOADING OFF
        searchIcon.classList.remove("fas", "fa-circle-notch", "fa-spin");
        searchIcon.classList.add("fa", "fa-search");

        // DISPLAY WEATHER TODAY TYPING CITY
        animationIn();
        // console.log(localization);
        animationIn();
        local.textContent = `${data.local.city} - ${data.local.country}`;
        todayDegree.textContent = todayData.temperature;
        todayInformations.textContent = todayData.humidity;
        todayIcon.innerHTML = `<img src="/assets/weather-icons/${selectIcon(todayData.weatherCode, todayData.hour)}.svg" alt="todayicon">`;
        // CLEAR INPUT AFTER SUBMIT
        inputCityName.value = '';

        //  GET MAX AND MIN TEMP FROM EACH DAY TYPING CITY NAME
        const arrMaxMin = data.nextDays.map((item, index) => `
      <div>
        <p class="dayOfWeek">${weekDay[item.dayOfWeek]}</p>
        <div class="nextDayIcon${index}">
            <img src="/assets/weather-icons/${selectIcon(item.weatherCode, 0)}.svg" alt = "nextdaysicons">
        </div >
        <div class="maxmin">
            <i class="fas fa-arrows-alt-v"></i>
            <div>
                <p class="max"><span>${Math.round(item.tempMax)}°C</span></p>
                <p class="min"><span>${Math.round(item.tempMin)}°C</span></p>
            </div>
        </div> 
      </div >
    `).slice(0, 6).join('');
        // console.log(arrMaxMin);

        //DISPLAY WEATHER OF NEXT DAYS TYPING CITY NAME
        nextDays.innerHTML = arrMaxMin;
    }
};

// HANDLE ENTER KEY AND MOUSE CLICK EVENTS
inputCityName.addEventListener('keyup', getWeatherByCityName);
searchIcon.addEventListener('click', getWeatherByCityName);


//DISPLAY ERROR
const displayError = () => {
    // SHOW ALERT
    alertPopUpIconChange();

    alertPopUp.style.display = 'flex';
    alertMessage.innerHTML = "<h2>Your geolocation is not enabled or is not supported by your browser."
        + " Please, use input field to write your city name and get weather info.</h2>";

    searchIcon.classList.remove("fas", "fa-circle-notch", "fa-spin");
    searchIcon.classList.add("fa", "fa-search");
    freezePage2();

    alertClose.addEventListener('click', () => {
        alertPopUp.style.display = 'none';
        unfreezePage2();
    })
};