/* 
    Dynamic loading page
*/
if (document.getElementById('post-container')){
    let currentPage = 1;    // current page
    const limit = 9;        // posts loaded per req
    let loading = false;    // prevent multiple reqs at once
    let reachedEnd = false; // check if we've loaded the last post

    // fetch posts and display them on the page
    async function fetchPosts(page, limit){
    const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;

        try{
            const response = await fetch(url);
            const posts = await response.json();

            // check if we've hit last page
            if (posts.length < limit){
                reachedEnd = true;
            }

            // add posts to container
            const postContainer = document.getElementById('post-container'); 
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post'); 
                
                const postTitle = document.createElement('h2');
                postTitle.textContent = post.title;
            
                const postBody = document.createElement('p');
                postBody.textContent = post.body;
            
                postDiv.appendChild(postTitle);
                postDiv.appendChild(postBody);
                postContainer.appendChild(postDiv);
            });
        } catch(error){
            console.error("Error fetching posts: ", error);
        } finally{
            loading = false;
        }
    }

    // detect when user has scrolled to the bottom
    function scrollHandler(){
        const scrollH = document.documentElement.scrollHeight - window.innerHeight;

        // when getting close to bottom, load more
        if (window.scrollY >= scrollH - 200 && !loading){
            loading = true;

            // check if last page reached
            if (reachedEnd){
                currentPage = 1;    // if so, start over
                reachedEnd = false;
            } else{
                currentPage++;      // else, load next page
            }
            fetchPosts(currentPage, limit);
        }
    }

    // initial load
    fetchPosts(currentPage, limit);

    // scroll event listener
    window.addEventListener('scroll', scrollHandler);
}


/* 
    Weather page
*/
if (document.getElementById('weather')){

    // fetch data and display
    async function fetchWeather(apiurl, elementId){
        try{
            const response = await fetch(apiurl);
            if (!response.ok){
                throw new Error(`Error fetching data: ${response.status}`);
            }
            const data = await response.json();

            const temp = document.getElementById(`${elementId}-temp`);
            const wind = document.getElementById(`${elementId}-wind`);
            const desc = document.getElementById(`${elementId}-desc`);
            
            temp.textContent = `🌡️ Temperature: ${data.current_weather.temperature} °C`;
            wind.textContent = `💨 Windspeed: ${data.current_weather.windspeed} km/h`;
            const weatherDescription = weatherDesc(data.current_weather.weathercode);
            desc.textContent = `${weatherDescription}`;

        } catch(error){
            console.error("Error fetching data: ", error);
        }
    }

    // find desc for corresponding weathercode
    function weatherDesc(code){
        switch(code){
            case 0: return "☀️ Clear sky";
            case 1: return "🌤️ Mainly clear";
            case 2: return "🌥️ Partly cloudy"
            case 3: return "☁ Overcast";
            case 45:
            case 48: return "🌫️ Fog"
            case 51: return "🌧️ Drizzle: Light";
            case 53: return "🌧️ Drizzle: Moderate";
            case 55: return "🌧️ Drizzle: Dense";
            case 56: return "🌧️ Freezing drizzle: Light";
            case 57: return "🌧️ Freezing drizzle: Dense";
            case 61: return "🌧️ Light rain";
            case 63: return "🌧️ Moderate rain";
            case 65: return "🌧️ Heavy rain";
            case 66: return "🌧️ Light freezing rain";
            case 67: return "🌧️ Heavy freezing rain";
            case 71: return "🌨️ Slight snow fall";
            case 73: return "🌨️ Moderate snow fall";
            case 75: return "🌨️ Heavy snow fall";
            case 77: return "🌨️ Snow grains";
            case 80: return "🌧️ Slight rain showers";
            case 81: return "🌧️ Moderate rain showers";
            case 82: return "🌧️ Violent rain showers";
            case 85: return "🌨️ Slight snow showers";
            case 86: return "🌨️ Heavy snow showers";
            case 95: return "⚡ Thunderstorm";
            case 96: return "⚡Thunderstorm with slight hail";
            case 99: return "⚡Thunderstorm with heavy hail";
            default: return "Unknown weather code";
        }
    }

    // call fetch function for each location
    function updateWeather(){
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true', 'tokyo');
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=59.9127&longitude=10.7461&current_weather=true', 'oslo');
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current_weather=true', 'london');
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&current_weather=true', 'ny');
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=38.6275&longitude=-92.5666&current_weather=true', 'cali');
        fetchWeather('https://api.open-meteo.com/v1/forecast?latitude=40.4165&longitude=-3.7026&current_weather=true', 'madrid');
    }

    // initial load
    updateWeather();
    
    // update every minute 
    setInterval(updateWeather, 60000);
}

