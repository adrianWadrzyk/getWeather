const form = document.querySelector('.form');
const time = new Date();


form.addEventListener('submit',  e => { 
    e.preventDefault();
    const city = document.querySelector('.city').value;
    getWheatherOfCity(city);
});

function getWheatherOfCity(city) {    
    const appID = "e5e282647052b2d223587665b7427151";
    if(!checkStorage(city)) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appID}`)
        .then(resp => {
            if(resp.ok)
              return resp.json();
            else 
              return Promise.reject(resp);
        })
        .then(resp => {
                   const weather_details = { 
                        country : resp.sys.country, 
                        weather : resp.weather[0].description,
                        name : resp.name,
                        temp : Math.floor(resp.main.temp - 273.15),
                        time : time.getTime()
                    };
                window.localStorage.setItem('weather',JSON.stringify(weather_details));
                createWheatherInfo(weather_details);
        })
    .catch(error => {
            document.querySelector('.weather').innerText = "Nie znaleziono takiego miasta";
            document.querySelector('.cityName').innerText = "";
            document.querySelector('.temperature').innerText = "";
        });
    }
}

function checkStorage (city) { 
    const storage = JSON.parse(window.localStorage.getItem("weather"));
   
    if(!!storage && city.toLowerCase() == storage.name.toLowerCase() && (time.getTime() - storage.time) < 600000) {
        createWheatherInfo(storage);
        return true;
    }
    return false;
}

function createWheatherInfo(obj) { 
    const { weather, name, temp} = obj;
    document.querySelector('.weather').innerText = weather;
    document.querySelector('.cityName').innerText = name;
    document.querySelector('.temperature').innerText = temp;
}
