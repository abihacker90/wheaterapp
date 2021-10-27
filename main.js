const cityArray = ["Budapest", "Berlin", "New York", "London", "Paris" ]; // array to populate dropdown menu

const elementsA = {}; // object for storing HTML elements

// function for getting images from Pexels API
function picturePexels (value) {
    fetch("https://api.pexels.com/v1/search?query="+value+" landscape&per_page=1",{
    headers: {
        Authorization: "563492ad6f91700001000001b930ab7400ce4c798f532737cd033945"
    }
    })

    .then(resp => {
        return resp.json()
    })
    .then(data => {

        const picUrl = "url("+`${data.photos[0].src.medium}`+")";
        const picture = document.getElementById("container");
      /*   picture.innerHTML = `<img src="${data.photos[0].src.medium}" alt="" title="">`; */
       
        picture.style.background = picUrl;
        picture.style.backgroundSize = 'cover';
        picture.style.backgroundPosition = 'center center';

    })

}

// function to fetch data for select event from dropdown
function inpEvent() {

    elementsA.spinner.removeAttribute('hidden');

    fetch("https://api.weatherapi.com/v1/current.json?key=9ee33dfc446f448685981652212106&q="+elementsA.selectElement.value+"")
        .then(response => response.json())
        .then(x => new Promise(resolve => setTimeout(() => resolve(x), 500)))
        .then(data => { 

            elementsA.spinner.setAttribute('hidden', '');

            picturePexels(elementsA.selectElement.value);
            
            elementsA.cityName.innerHTML = `${data.location.name}`;
            elementsA.temp.innerHTML = `<h2> Celsius:  ${data.current.temp_c}</h2>`;
            elementsA.sky.innerHTML = `<h2> ${data.current.condition.text}</h2><img src="${data.current.condition.icon}" alt="${data.current.condition.text}" title="${data.current.condition.text}">`;
            elementsA.hum.innerHTML = `<h2> Humidity:  ${data.current.humidity}</h2>`;
            
            
        });     
}
function citySearch(e) {

    if (elementsA.inputElement.value.length >= 4) {

        fetch('http://api.weatherapi.com/v1/search.json?key=9ee33dfc446f448685981652212106&q='+elementsA.inputElement.value)
            .then(response => response.json())
            .then(data => { 

                for (let i = 0; i <data.length; i++) {
                    elementsA.dataElement.insertAdjacentHTML("beforeend", `<option value="${data[i].name}">`)
                }
            });
    }

}

// function to get data for location entered via search input
function fetchSearchInput() {

    elementsA.spinner.removeAttribute('hidden'); //show spinner until fetch starts
      
    fetch("https://api.weatherapi.com/v1/current.json?key=9ee33dfc446f448685981652212106&q="+elementsA.inputElement.value+"")
    .then(response => response.json())
    .then(x => new Promise(resolve => setTimeout(() => resolve(x), 500))) //add delay so spinner stays visible for longer
    .then(data => { 
        
            elementsA.spinner.setAttribute('hidden', ''); //hide spinner after fetch ends

            let cityNameSplit = elementsA.inputElement.value.split(",")[0]; //get first element from the location string returned by fetch

            picturePexels(cityNameSplit); //call Pexels function for the location name
            
            // enter weather data in placeholders
            elementsA.cityName.innerHTML = cityNameSplit;
            elementsA.temp.innerHTML = `<h2> Celsius: ${data.current.temp_c}</h2>`;
            elementsA.sky.innerHTML = `<h2> ${data.current.condition.text}</h2><img src="${data.current.condition.icon}" alt="${data.current.condition.text}" title="${data.current.condition.text}">`;
            elementsA.hum.innerHTML = `<h2> Humidity:  ${data.current.humidity}</h2>`;            
        }
    );     
}


function loadEvent() {
    
    elementsA.rootElement = document.getElementById('root');
    
    //add basic structural elements in root div
    elementsA.rootElement.insertAdjacentHTML("afterbegin", ` 
      
    <nav>
        <label> Choose from our favourite cities </label>
            <select>
                <option value="" disabled selected>Select a City</option>
            </select>         
        <label> Or Search for yours</label>
        <input list="cities" name="inpSearch" id="inpSearch">
        <datalist id="cities">
        </datalist>
    </nav>
    
    <div id="container">
        <div hidden id="spinner"></div>
        <div id="picture-text"> 
            <h1 id="cityName"></h1>
            <div id="temp"> <h2> </h2> </div>
            <div id="sky"> <h2> </h2> </div>
            <div id="hum"> <h2> </h2> </div>
        </div>
    </div>

    <footer>
        <a href="https://www.pexels.com">Photos provided by Pexels</a>
    </footer>
    `
    );

    // define base html elements by ID and save them to an array
    elementsA.inputElement = document.getElementById('inpSearch');
    elementsA.spinner = document.getElementById("spinner");  
    elementsA.selectElement = document.querySelector('select');
    elementsA.dataElement = document.getElementById('cities');
    elementsA.temp = document.getElementById('temp');
    elementsA.sky = document.getElementById('sky');
    elementsA.hum = document.getElementById('hum');
    elementsA.cityName = document.getElementById('cityName');

    // add cities from pre-defined array to dropdown menu
    for (let i = 0; i < cityArray.length; i++) {
        elementsA.selectElement.insertAdjacentHTML("beforeend", `<option>${cityArray[i]}</option>`); 
    }

    //add the event listeners 

    elementsA.selectElement.addEventListener("input", inpEvent); // event listener for fetching data for city selected in dropdown menu
    elementsA.inputElement.addEventListener("input", citySearch); // event listener for searching for a list of cities 
    elementsA.inputElement.addEventListener("change", fetchSearchInput) //event listener to fetch data for city selected in search
   
}

window.addEventListener("load", loadEvent);