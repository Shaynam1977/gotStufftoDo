
var searchedData = []

var rootUrl = 'https://api.openweathermap.org'

var apiKey = 'df3fb9934a7d8ebae97c6749b588071a'
var searchBtn = document.querySelector("#search-button")
var fiveDay = document.querySelector(".five-day")
var searchInput = document.querySelector("#search-input")


var now = dayjs('2019-01-25').toDate()


function search(city) {
  fetch(
 
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.weather[0].icon, "here")
      $("#weather-results").css("display", "block");
      $("#city-info").empty();

      var iconCode = data.weather[0].icon;
      var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

     
      var currentCity = $(`
            <h2 id="currentCity">
                ${data.name} ${now}} <img src="${iconURL}" alt="${data.weather[0].description}" />
            </h2>
            <p>Temperature: ${data.main.temp} °Celsius</p>
            <p>Humidity: ${data.main.humidity}\%</p>
            <p>Wind Speed: ${data.wind.speed} KM/H</p>
        `);

      $("#city-info").append(currentCity);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
    })
      
          fetch(
            //Query for 5 day forecast
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (weekResponse) {
              
              $(".five-day").empty();

              let fiveDayArray = weekResponse.list.filter(day => day.dt_txt.includes('12:00:00'));
                    for (let i = 0; i < fiveDayArray.length; i++) {

                        // Creating array to loop through 5 day data and creating div to append
                var currDate =  new Date(fiveDayArray[i].dt_txt).toLocaleString().split(',')[0];
                var iconURL = fiveDayArray[i].weather[0].icon;
                var iconPic = `<img src="http://openweathermap.org/img/wn/${iconURL}@2x.png"/>`        
                var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body ">
                            <p>${iconPic}</p>
                            <p>${currDate}</p>
                            <p>Temperature: ${fiveDayArray[i].main.temp} °C</p>
                            <p>Humidity: ${fiveDayArray[i].main.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

                $(".five-day").append(futureCard);
              }
            });
        });
    });
   
    
}




function saveSearch(cityName) {
    var storedCity = document.getElementById("search-input").value;
    localStorage.setItem(cityName, storedCity);
    var createLi = document.createElement("li");
    createLi.className += "history-btn"
    createLi.textContent = storedCity;
    document.getElementById("searchHistory").appendChild(createLi);
  }
  

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    saveSearch();
    var city = $("#search-input").val().trim();
    search(city);
   searchInput.value = "";
    
  });
  

$(document).on("click", "#searchHistory li", function() {
    var listCity = $(this).text();
    search(listCity);
});