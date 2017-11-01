let currentPrices = {};
let currentCoin;
let coinLookup = {
  ethereum: 'ETH',
  bitcoin: 'BTC',
  zcash: 'ZEC',
  dash: 'DASH',
  litecoin: 'LTC'
};

$(document).ready(function () {

  console.log('charts.js loaded - sanity check');

  currentCoin = window.location.pathname.split('/')[1];

  getCurrentPrices(['ETH','BTC','ZEC','DASH','LTC']);

})


function getCurrentPrices(arr){
  let whichCoins = arr.join(',');
  let pricesUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${whichCoins}&tsyms=USD`
  $.ajax({
    method: "GET",
    url: pricesUrl
  })
  .then(function(prices) {
    arr.forEach((sym) => {
      let price = prices[sym].USD
      currentPrices[sym] = price
    })
    if (currentCoin) {
      createPriceChart(currentCoin);
    }
  }).catch(function(err){
    console.log(err);
  })
}

function createPriceChart(coin) {
  let coinSym = coinLookup[coin];
  let $destination = $(`.${coin}Chart`);
  let getUrl = `https://min-api.cryptocompare.com/data/histohour?fsym=${coinSym}&tsym=USD&limit=24&aggregate=3&e=CCCAGG`;
  $.ajax({
    method: "GET",
    url: getUrl
  })
  .then(function(prices){
    // Format received price data to just show for the past ~24 hours with the most recent price as the last data point
    priceArr = prices.Data;
    let priceTimes = priceArr.map((dataPoint) => { return moment.unix(dataPoint.time).fromNow() });
    let priceValues = priceArr.map((dataPoint) => { return dataPoint.open});
    let baselinePrice = priceValues[15];
    let finalTimes = priceTimes.slice(16, 25);
    let finalValues = priceValues.slice(16,25);
    finalTimes.push("Now");
    finalValues.push(currentPrices[coinSym]);

    // set chart color based on recent token price performance
    let chartColor;
    if (baselinePrice <= currentPrices[coinSym]) {
      chartColor = 'rgb(9, 196, 115)';
    } else {
      chartColor = 'rgb(226, 4, 4)';
    }

    // Set horizontal line based on the price before chart cutoff
    let baselineArr = finalTimes.map((time) => { return baselinePrice});
    let newPriceChart = new Chart($destination, {
      type: 'line',
      data: {
          labels: finalTimes,
          datasets: [
            {
              label: `Price of ${coin}`,
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgb(63, 63, 63)',
              borderCapStyle: 'butt',
              borderDash:[],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderWidth: 1,
              pointRadius: 1,
              borderColor: chartColor,
              data: finalValues
          },
          {
            label: "Previous Price",
            fill: false,
            borderColor: 'rgb(214, 91, 255)',
            borderWidth: 4,
            borderDash: [3, 5],
            pointStyle: 'line',
            data: baselineArr,

          }
        ]
      },
      options: {
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 18
            }
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "white",
              fontSize: 20
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: "white"
            },
            ticks: {
              fontColor: "white",
              fontSize: 20
            },
            scaleLabel: {
              display: true,
              labelString: 'Value in USD',
              fontColor: "white",
              fontSize: 25
            }
          }]
        }
      }
    });
  }).catch(function(err){
    console.log(err);
  })
}
