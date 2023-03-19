module.exports = {
  formatData: (data) => {
    const wmoCode = require('../data/wmoCode.json');
    const length = data.daily.time.length;
    let params = { data: [] };
    for (let i = 0; i < length; i++) {
      const date = new Date(data.daily.time[i] * 1000).toLocaleDateString().slice(0, 10);
      const weatherCode = data.daily.weathercode[i];
      const maxTemp = data.daily.temperature_2m_max[i];
      const minTemp = data.daily.temperature_2m_min[i];
      const windSpeed = data.daily.windspeed_10m_max[i];
      const dataObj = {
        date: date,
        weather: wmoCode[weatherCode],
        maxTemp: `${maxTemp} ${data.daily_units.temperature_2m_max}`,
        minTemp: `${minTemp} ${data.daily_units.temperature_2m_min}`,
        windSpeed: `${windSpeed} ${data.daily_units.windspeed_10m_max}`
      }
      params.data.push(dataObj);
    }
    return params;

  }
}