const express = require('express');
const router = new express.Router();
const env = require('dotenv').config();
const axios = require('axios');
const { fetchData, insertData } = require('../models/index');
const { formatData } = require('../lib/library');

router.get('/', async(req, res) => {

  let params;

  // データベースから天気予報を取得
  const data = await fetchData();
  const isEmpty = data == null || data.length == 0;
  const isNotEnough = data.length < 7;

  // API経由で天気予報を取得
  if (isEmpty || isNotEnough) {
    const endpoint = process.env.WEATHER_FORECAST_ENDPOINT;
    const fetchWeatherForecast = await axios.get(endpoint);
    params = formatData(fetchWeatherForecast.data);
  } else {
    params = { data: data };
  }

  // データベースに天気予報を挿入
  if (isEmpty) {
    const canInsert = await insertData(params.data);
    if (!canInsert) {
      console.log('データベースへの挿入に失敗しました。');
      res.render('/404', {message: 'データベースへの挿入に失敗しました。'});
    }
  } else if (isNotEnough) {
    const length = data.length;
    const insertDataArr = params.data.slice(length);
    const canInsert = await insertData(insertDataArr);
    if (!canInsert) {
      console.log('データベースへの挿入に失敗しました。');
      res.render('/404', {message: 'データベースへの挿入に失敗しました。'});
    }
  }

  // データを日付順に並び替え
  params.data.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  });

  // レンダリング
  res.render('../views/index.ejs', params);
});

module.exports = router;