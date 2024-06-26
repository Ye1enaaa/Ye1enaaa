import dotenv from 'dotenv';
import Mustache from 'mustache';
import fetch from 'node-fetch';
import fs from 'fs';

const MUSTACHE_MAIN_DIR = './main.mustache';
let DATA = {
  name: 'Erickson',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Singapore',
  }),
};

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=8.4803&lon=124.6498&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
    //`https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
    .then(r => r.json())
    .then(r => {
      DATA.temperature = Math.round(r.main.temp);
      DATA.weather = r.weather[0].description;
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  await setWeatherInformation();   
  await generateReadMe();
}

action();
