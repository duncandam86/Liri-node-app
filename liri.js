require("dotenv").config();

// Load packages
let NodeSpotify = require("node-spotify-api");
let request = require("request");
let moment = require("moment");
let fs = require("fs");
let keys = require("./keys.js");

//store arguments
let command = process.argv[2];
let nodeArgs = process.argv;


//string movie, song or bandname
let searchName = nodeArgs.slice(3).join("+");
// console.log(searchName);

//create function to search for movie
function omdbMovie(movie) {
    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(omdbURL, function (error, response, body) {
        // console.log(response)
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            //console.log(body);
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
        }

        else {
            console.log('Error occurred.')
        }
    })
}
if (command === "movie-this") {
    if (searchName) {
        omdbMovie(searchName);
    }
    if (command === " ") {
        console.log("----------------------------");
        console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix");
        console.log("----------------------------");
        omdbMovie("Mr.Nobody");
    }
}

//Create function to search for band in town
function bandInTown(artist) {
    var bandInTownURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(bandInTownURL, function (error, response, body) {
        //console.log (response)
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            //console.log (body)
            for (let i = 0; i < body.length; i++) {
                console.log("Name of Venue: " + body[i].venue.name);
                console.log("Venue Location: " + body[i].venue.city + ", " + body[i].venue.region + ", " + body[i].venue.country);
                console.log("Date of the Event: " + moment(body[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
            }
        }
    })
}
if (command === "concert-this") {
    if (searchName) {
        bandInTown(searchName);
    }
}

//Create function to search for spotify song
function searchSpotifySong(song) {
    var spotify = new NodeSpotify(keys.spotify)

    // console.log(spotify);

    spotify.search({ type: 'track', query: song }, function (err, data) {
        //console.log(data);
        //console.log(data.tracks);
        //console.log(data.tracks.items[0]);
        //console.log(data.tracks.items[0].album);
        //console.log(data.tracks.items[0].album.artists);
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("The song's name: " + data.tracks.items[0].name);
            console.log("Preview link of the song: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
}

if (command === "spotify-this-song") {
    if (searchName) {
        searchSpotifySong(searchName);
    }
    else {
        searchSpotifySong("The Sign by Ace of Base")
    }
}

if (command === " ") {
    searchSpotifySong("The Sign")
}


//create function for doWhatItSay 
function doWhatitSay() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        //console.log(data);
        var random = data.split(",")
        // console.log(random);
        // console.log(random[0]);
        // console.log(random[1]);

        searchSpotifySong(random[1])
    });
}
if (command === "do-what-it-says") {
    doWhatitSay();
}

