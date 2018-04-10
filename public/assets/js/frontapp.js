// decode query string
// https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js/21903119
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}

// var tempString = "For your abominable acts. you shall be lashed. To. The Slave Stick!";

// var space = ' ';
// var period = '.';

// // splitString(tempString, space);
// splitString(tempString, period);

// api key
var key = "1b6dad2788669a0591d7860828345278";
// array that will hold the shelter's unique ID's

if ($('#rescue-details').length) {
    var id = $.urlParam('id');

    var queryURL = "http://api.petfinder.com/pet.get?format=json&key=" + key + "&id=" + id;

    // first ajax call
    $.ajax(
        {
            url: queryURL,
            jsonp: "callback",
            dataType: "jsonp",
            method: "GET",
            contentType: "text/json;charset=utf-8"
        }).then(function (results) {
            console.log("Success!");
            console.log(results);

            // loop that will take info from response and make it useable, will repeat until we have 10 animals
            results = results.petfinder.pet;

            // variable for new div that will hold all of the information we want to display for the animal
            var animalDiv = $("<div>").addClass("animal rescue-info ");
            // variable that holds the animals picture
            var newImage = $("<img>").attr("src", results.media.photos.photo[3].$t).addClass('rescue-image');
            // variable to hold the animals name, sets it as an h3
            var aniName = $("<h1>").text(results.name.$t);
            // variable that holds the animals description provided by the shelter
            var parts = (results.description.$t || "").split('\n');
            var info = $("<div>").addClass('result-desc-long');
            parts.forEach(function(part) {
                info.append($("<p>").text(part));
            });
            // variable to hold the unique ID for the shelter the animal comes from, will be used in another api request
            var shelter = results.shelterId.$t;

            // div appends our variables
            animalDiv.append(aniName);
            animalDiv.append(newImage);
            animalDiv.append(info);

            // prepends the info that is already in animalDiv to our html page
            $("#rescue-details").prepend(animalDiv);

            // pushes each shelter's unique ID to an array to be used by a second ajax call that will return the shelter's address
            return shelterCall(shelter);

        }).then(function (response) {
            console.log(response);

            var name = response.petfinder.shelter.name.$t;
            var emailAddress = response.petfinder.shelter.email.$t;

            var address1 = response.petfinder.shelter.address1.$t;
            var address2 = response.petfinder.shelter.address2.$t;
            var city = response.petfinder.shelter.city.$t;
            var state = response.petfinder.shelter.state.$t;
            var zip = response.petfinder.shelter.zip.$t;

            var fullAddress = $("<div>").addClass("shelter-section");
            fullAddress.append($("<p>").text(address1).addClass('shelter-detail-line'));
            fullAddress.append($("<p>").text(address2).addClass('shelter-detail-line'));
            fullAddress.append($("<p>").text(city + ", " + state + " " + zip).addClass('shelter-detail-line'));

            var email = $("<p>").text("email: ").addClass('shelter-detail-line');
            if (emailAddress.indexOf('@') > 0) {
                email.append($("<a>").attr('href', 'mailto:' + emailAddress).text(emailAddress));
            }
            var phone = $("<p>").text("phone: " + response.petfinder.shelter.phone.$t).addClass('shelter-detail-line');
            var contactDiv = $("<div>").addClass('shelter-section');
            contactDiv.append(email).append(phone);

            var shelterDiv = $("<div>").addClass("shelter");
            var locale = $("<h4>").text(name).addClass('uk-card-header');

            var shelterBody = $("<div class='uk-card-body uk-padding-small'>");
            shelterBody.append(fullAddress);
            shelterBody.append(contactDiv);

            
            // var header = $("<p>").addClass("shelter-header").text("Shelter");

            // shelterDiv.append(header);
            shelterDiv.append(locale);
            shelterDiv.append(shelterBody);

            $("#shelter-details").append(shelterDiv);
        }).catch(function (error) {
            console.log(error);
        });
};



// runs first ajax call on button click. 
$("#submit").on("click", function () {
    var promiseArr = [];
    event.preventDefault();

    // variables that hold values entered by user. based on what search parameters the user enters
    var zip = $("#zipcodeInput").val().trim().toLowerCase();
    zip = zip.split(',').join('');
    if (zip.trim().length == 0) {
        displayError('Location Required', "Please specify a zip code or a city and state.");
        return;
    }
    zip = zip ? "&location=" + zip : '';

    var animal = $("#animalTypeInput").val().trim().toLowerCase();
    if (animal == "Other...") animal = $('#animal-type-other').val().trim();
    animal = (animal == "any") ? "" : "&animal=" + animal;

    var size = ($('#animal-size').val() || "any").trim().toUpperCase();
    size = (size == "ANY") ? "" : "&size=" + size;

    var sex = ($('#animal-sex').val() || "any").trim().toUpperCase();
    sex = (sex == "ANY") ? "" : "&sex=" + sex;
    // var breed = $("#breedInput").val().trim();

    var count = 10;

    // query string for first call
    // var queryURL = "http://api.petfinder.com/pet.find?format=json&key=" + key + "&location=" + zip + "&animal="+ animal + "&output=full&count=10&callback=?";
    var queryURL = "http://api.petfinder.com/pet.find?format=json&key=" + key + zip + animal + size + sex + "&output=full&count=10&callback=?";

    // first ajax call
    $.ajax(
        {
            url: queryURL,
            jsonp: "callback",
            dataType: "jsonp",
            method: "GET",
            contentType: "text/json;charset=utf-8"
        }).then(function (response) {
            $("#apiView").empty();

            console.log("Success!");
            console.log(response);

            // loop that will take info from response and make it useable, will repeat until we have 10 animals
            for (var i = 0; i < count; i++) {
                // short cut so that we can use the values of 'response' more easily
                var results = response.petfinder.pets.pet[i];

                // variable for new div that will hold all of the information we want to display for the animal
                var animalDiv = $("<div>").addClass("animal rescue-item uk-card uk-card-default uk-card-body ");
                // variable that holds the animals picture
                var newImage = $("<img>").attr("src", results.media.photos.photo[3].$t).addClass('rescue-thumb');
                var aniNameLink = $("<a>").attr('href', '/rescueDetails?id=' + results.id.$t).text(results.name.$t)
                // variable to hold the animals name, sets it as an h3
                var aniName = $("<h3>").append(aniNameLink);
                // variable that holds the animals description provided by the shelter
                var info = $("<p>").text(results.description.$t).addClass('result-desc');
                var infoShadow = $("<div>").addClass("rescue-desc-shadow");
                // variable to hold the unique ID for the shelter the animal comes from, will be used in another api request
                var shelter = results.shelterId.$t;

                // div appends our variables
                animalDiv.append(newImage);
                animalDiv.append(aniName);
                animalDiv.append(infoShadow);
                animalDiv.append(info);

                // prepends the info that is already in animalDiv to our html page
                $("#apiView").prepend(animalDiv);

                // pushes each shelter's unique ID to an array to be used by a second ajax call that will return the shelter's address
                // promiseArr.push(shelterCall(shelter));
            }
            // 
            // return Promise.all(promiseArr);
            return [];
        }).then(function (promiseArrData) {
            console.log(promiseArrData);
            promiseArrData.forEach(function (response, index) {
                console.log(response);

                var name = response.petfinder.shelter.name.$t;

                var address1 = response.petfinder.shelter.address1.$t;
                var address2 = response.petfinder.shelter.address2.$t;
                var city = response.petfinder.shelter.city.$t;
                var state = response.petfinder.shelter.state.$t;

                var fullAddress = $("<p>").text(address1 + ", " + address2 + ", " + city + ", " + state);

                var phone = $("<p>").text(response.petfinder.shelter.phone.$t);

                var shelterDiv = $("<div>").addClass("shelter uk-card");
                var locale = $("<h4>").text("Name of Shelter: " + name);
                locale.addClass('uk-card-header');

                var details = $('<div>').addClass("uk-card-body");
                details.append(fullAddress).append(phone);

                shelterDiv.append(locale);
                // shelterDiv.append(fullAddress);
                // shelterDiv.append(phone);
                shelterDiv.append(details);

                $(".animal").eq(index).append(shelterDiv);
            });
        }).catch(function (error) {
            console.log(error);
        });
});

function shelterCall(shelter) {
    var queryURL2 = "http://api.petfinder.com/shelter.get?format=json&key=" + key + "&id=" + shelter + "&callback=?";

    return $.ajax(
        {
            url: queryURL2,
            jsonp: "callback",
            dataType: "jsonp",
            method: "GET"
        });
}

/////////////////////////////////////////////////////////////

/*This function will be used at a later date. Should cut info from the pet's description that matches what the user is looking for*/

// function splitString(stringToSplit, separator)
// {
// 	var stringArray = stringToSplit.split(separator);

// 	console.log("Function Start");

// 	console.log("The original string is: '" + stringToSplit + "'");
// 	console.log("The separator is: '" + separator + "'");
// 	console.log("The array has " + stringArray.length + " elements: " + stringArray.join('/'));

// }

/////////////////////////////////////////////////////////////
$('#animal-type-other').hide();

$('#animal-type').on('change', function () {
    var showOther = $('#animal-type').val() == "Other...";
    if (showOther) {
        $('#animal-type-other').show();
    } else {
        $('#animal-type-other').hide();
    }
});