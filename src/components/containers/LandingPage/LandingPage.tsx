import React, { useCallback, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


// TODO:
// begin with using what is available in python perhaps?
// Get input component
// Get stock data once
// Make a way to request stock data for different tickers
// Make a way to request stock data at different time scales
// Determine what else to graph
// Add VIX FIX
// https://api.polygon.io/v2/aggs/ticker/QQQ/range/1/minute/2021-12-01/2020-12-01?adjusted=true&sort=asc&apiKey=


export const LandingPagePath = '/';

export const LandingPage = () => {
  const [tickerDataState, setTickerDataState] = useState([]);
  
  const buildOptions = (data: any) => ({
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    dataset: {
      source: data,
      dimensions: ['timestamp', 'closing'],
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'time',
        type: 'line',
        encode: {
          x: 'timestamp',
          y: 'closing',
        },
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  });

  const [optionsState, setOptionsState] = useState(buildOptions([]));

  const updateOptionsState = useCallback((data) => {
    const newOptions = buildOptions(data);
    console.log(newOptions);
    return setOptionsState(newOptions);
  }, [buildOptions, setOptionsState])

  useEffect(() => {
    const getData = async () => {
      return fetch('https://api.polygon.io/v2/aggs/ticker/QQQ/range/1/minute/2020-12-01/2022-12-01?adjusted=true&sort=asc&apiKey=')
        .then(data => data.json())
        .then(res => {
          console.log(res);
          // format of each point will be time, close
          const formatted = res.results.map((c: string, t: number) => {
            // time is t, closing price for that minute is c
            return [t, c];
          });
          updateOptionsState(formatted)
          setTickerDataState(formatted)
        });
    }

    getData();

  }, [setTickerDataState, updateOptionsState])
  
  


  return (
    <div>
      <h1>Landing Page</h1>
      <div>graph of stock, stock lookup</div>
      {
        tickerDataState.length > 0 ?
          (<ReactECharts option={optionsState} />) : <div/>
      }
    </div>
  )
};
