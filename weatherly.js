var areaName;
var latitude;
var longitude;
var map;
var num = 0;

//******Recieve Lat and Long
function addressLookup_Complete(result) {
    latitude = result.results[0].geometry.location.lat;
    longitude = result.results[0].geometry.location.lng;
    areaName = result.results[0].address_components[1].short_name + "," +
        result.results[0].address_components[2].short_name;
    getWeather(latitude, longitude);
    
}


//google lat and long clean up loop
function addressLookup(city, state, address) {
    // Create the address.
    var addLocation = "";
    if (address.length != 0) {
        addLocation = address.trim();
    }
    else if (city.length != 0 && state != 0) {
        addLocation = city.trim() + ", " + state;
    }
    else {
        return;
    }


    //compiling the url for darkSky from google
    var googleTag = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addLocation + "&key=AIzaSyBZfkXozgEve7U6AezGLYljEVMRR-EFUuo";

    var request = {
        url: googleTag,
        success: addressLookup_Complete
    };

    $.ajax(request);
}


//******Textbox Var storage
function lookupLocation_click() {
    var pcode = $("#address").val();
    addressLookup("", "", pcode);
    $('#address').children('input').val('');
}

//*******************Click event
$(function () {
    $("#lookupLocation").on("click", lookupLocation_click);

});



//***************Call darkSky

function getWeather(latitude, longitude) {
    var darkSky = "https://api.darksky.net/forecast/ed7be92607845014ac1b22c8b2dcb545/" + latitude + "," + longitude;
    var weather = {
        url: darkSky,
        dataType: "jsonp",
        success: weather_Complete
    };

    $.ajax(weather);
}

//*************Recieve weather Data

function weather_Complete(result) {
    console.log("It is currently " + result.timezone + ".");

    var data = {
        time: new Date(result.currently.time * 1000),
        lrgTemp: Math.round((result.currently.temperature)) + "&deg",
        crntCond: (result.currently.summary),
        tempMin: Math.round((result.daily.data[0].temperatureMin)) + "&deg",
        rainChance: (result.daily.data[0].precipProbability),
        maxTemp: Math.round((result.daily.data[0].temperatureMax)) + "&deg",
        minText: ("Min"),
        rainChancetext: ("Rain Chance"),
        maxText: ("Max"),
        icon: (result.currently.icon)
    };

    postCard(data);
   
    


}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'+ num), {
        center: { lat: +latitude, lng: +longitude },
        zoom: 12
    });
    num++;
    var myLatLng = { lat: +latitude, lng: +longitude };
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Your Location'

    });
    marker.setMap(map);

}





//********** Generate New Card
function generateCard(data) {
    var weatherData = $("#newCard").html();
    
    weatherData = weatherData.replace("@@City@@", areaName);
    weatherData = weatherData.replace("@@date/time@@", data.time);
    weatherData = weatherData.replace("@@lrgDegree@@", data.lrgTemp);
    weatherData = weatherData.replace("@@cond@@", data.crntCond);
    weatherData = weatherData.replace("@@minTemp@@", data.tempMin);
    weatherData = weatherData.replace("@@rain%@@", data.rainChance + "%");
    weatherData = weatherData.replace("@@maxTemp@@", data.maxTemp);
    weatherData = weatherData.replace("@@Min@@", data.minText);
    weatherData = weatherData.replace("@@rainChance@@", data.rainChancetext);
    weatherData = weatherData.replace("@@Max@@", data.maxText);
    weatherData = weatherData.replace("@@class@@", data.icon);
    weatherData = weatherData.replace("@@mapClass@@", data.icon);
    weatherData = weatherData.replace("@@num@@", num);
    return weatherData;

}

function postCard(weatherData) {

    var html = generateCard(weatherData);
    $('#newCard2').append(html);
    
    initMap();
}


//disfunctioning div close button
// function closeCard(){
//     $("#weatherCard").parents("#newCard").remove("#weatherCard");

// }
// $(function (){
// $("#closeCard").on("click", closeCard());
// });

function removeDummy() {
    var elem = document.getElementById('weatherCard');
    elem.parentNode.removeChild(elem);
    return false;
}
