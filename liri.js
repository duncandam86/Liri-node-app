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


//string movie, song or artist
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
            console.log(`----------------------------\nTitle: ${body.Title}\nRelease Year: ${body.Year}\nIMdB Rating: ${body.imdbRating}\nRotten Tomatoes Rating: ${body.tomatoRating}\nCountry: ${body.Country}\nLanguage: ${body.Language}\nPlot: ${body.Plot}\nActors: ${body.Actors}\n----------------------------`);
            //added into log.txt
            fs.appendFile("log.txt", `----------------------------\nTitle: ${body.Title}\nRelease Year: ${body.Year}\nIMdB Rating: ${body.imdbRating}\nRotten Tomatoes Rating: ${body.tomatoRating}\nCountry: ${body.Country}\nLanguage: ${body.Language}\nPlot: ${body.Plot}\nActors: ${body.Actors}\n----------------------------`, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }

        else {
            console.log('Error occurred.')
        }
    })
}
//setting up command for movie-this
if (command === "movie-this") {
    if (searchName) {
        omdbMovie(searchName);
    }
    if (searchName === "") {
        console.log(`----------------------------\nIf you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>\nIt's on Netflix\n----------------------------`);
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
                console.log(`----------------------------\nName of Venue: ${body[i].venue.name}\nVenue Location: ${body[i].venue.city}, ${body[i].venue.region}, ${body[i].venue.country}\nDate of the Event: ${moment(body[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a")}\n----------------------------`);

                //add to log.txt
                fs.appendFile("log.txt", `----------------------------\nName of Venue: ${body[i].venue.name}\nVenue Location: ${body[i].venue.city}, ${body[i].venue.region}, ${body[i].venue.country}\nDate of the Event: ${moment(body[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a")}\n----------------------------`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    })
}
//setting up command for concert-this
if (command === "concert-this") {
    if (searchName) {
        bandInTown(searchName);
    }
}

//Create function to search for spotify song
function searchSpotifySong(song) {
    const spotify = new NodeSpotify(keys.spotify)

    // console.log(spotify);

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            console.log(`----------------------------\nArtist: ${data.tracks.items[0].artists[0].name}\nThe song's name: ${data.tracks.items[0].name}\nPreview link of the song: ${data.tracks.items[0].preview_url}\nAlbum: ${data.tracks.items[0].album.name}\n----------------------------`);
            
            //Append these data into a log.txt file
            fs.appendFile("log.txt", `----------------------------\nArtist: ${data.tracks.items[0].artists[0].name}\nThe song's name: ${data.tracks.items[0].name}\nPreview link of the song: ${data.tracks.items[0].preview_url}\nAlbum: ${data.tracks.items[0].album.name}\n----------------------------`, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}
//setting up command for spotify-this-song
if (command === "spotify-this-song") {
    if (searchName) {
        searchSpotifySong(searchName);
    }
    if (searchName === "") {
        searchSpotifySong("The Sign by Ace of Base")
    }
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

