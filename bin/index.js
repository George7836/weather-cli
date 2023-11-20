#! /usr/bin/env node
const yargs = require("yargs");
const axios = require("axios");
const fs = require("fs");
const weatherOptions = require("./weather.json");

yargs
  .option("t", {
    describe: "set API token",
    type: "string",
    demandOption: false,
  })
  .option("s", {
    describe: "set the city for which the information will be displayed",
    type: "string",
    demandOption: false,
  })
  .help("h", "show help")
  .version(false).argv;

const showWeather = async () => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weatherOptions.apiKey}&q=${weatherOptions.selectedCity}&aqi=no`
    );

    const weather = response.data;
    console.log("City: ", weather.location.name);
    console.log("Temperature: ", `${weather.current.temp_c} °C`);
    console.log(
      "Feels like temperature: ",
      `${weather.current.feelslike_c} °C`
    );
    console.log("Humidity: ", `${weather.current.humidity}%`);
    console.log("Cloud cover: ", weather.current.cloud);
    console.log("Wind speed: ", `${weather.current.wind_kph} kph`);
  } catch (error) {
    console.error(error.message);
  }
};

if (yargs.argv.t) {
  fs.readFile("./bin/weather.json", (error, data) => {
    if (error) throw error;

    const convertedData = JSON.parse(data);
    convertedData.apiKey = yargs.argv.t;

    fs.writeFile("./bin/weather.json", JSON.stringify(convertedData), (err) => {
      if (err) throw err;
    });

    console.log("A new API token has been added.");
  });
}

if (yargs.argv.s) {
  fs.readFile("./bin/weather.json", (error, data) => {
    if (error) throw error;

    const convertedData = JSON.parse(data);
    convertedData.selectedCity = yargs.argv.s + " " + yargs.argv._.join(" ");

    fs.writeFile("./bin/weather.json", JSON.stringify(convertedData), (err) => {
      if (err) throw err;
    });

    console.log("A new city has been selected:", convertedData.selectedCity);
  });
}

if (!yargs.argv.s && !yargs.argv.t && !yargs.argv.h) {
  showWeather();
}
