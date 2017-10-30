let currentPrices = {};
let currentCoin;
let coinLookup = {
  ethereum: 'ETH',
  bitcoin: 'BTC',
  zcash: 'ZEC'
};

$(document).ready(function () {

  $('.modal').modal();

  console.log('charts.js loaded - sanity check');
  currentCoin = window.location.pathname.split('/')[1];

  getCurrentPrices(['ETH','BTC','ZEC']);


// End of document ready
})


function getCurrentPrices(arr){
  let whichCoins = arr.join(',');
  let $prices = $('.display-prices');
  let pricesUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${whichCoins}&tsyms=USD`
  $.ajax({
    method: "GET",
    url: pricesUrl
  })
  .then(function(prices) {
    newHTML = ''
    arr.forEach((sym) => {
      let price = prices[sym].USD
      currentPrices[sym] = price
      newHTML += `<p class=${sym}>Current price of ${sym}: $${price} (USD)</p>`
    })
    $prices.append(newHTML);
    // console.log(currentCoin);
    if (currentCoin) {
      createPriceChart(currentCoin);
    }
  }).catch(function(err){
    console.log(err);
  })
}

function createPriceChart(coin) {
  let coinSym = coinLookup[coin];
  // console.log(coinSym);
  let $destination = $(`.${coin}Chart`);
  let getUrl = `https://min-api.cryptocompare.com/data/histohour?fsym=${coinSym}&tsym=USD&limit=24&aggregate=3&e=CCCAGG`;
  // console.log(getUrl);
  $.ajax({
    method: "GET",
    url: getUrl
  })
  .then(function(prices){
    // console.log('from currentPrices', currentPrices);
    priceArr = prices.Data;
    let priceTimes = priceArr.map((dataPoint) => { return moment.unix(dataPoint.time).fromNow();});
    let priceValues = priceArr.map((dataPoint) => { return dataPoint.open});
    // console.log('times arr', priceTimes);
    // console.log('prices arr', priceValues);
    let baselinePrice = priceValues[15];
    let finalTimes = priceTimes.slice(16, 25);
    let finalValues = priceValues.slice(16,25);
    finalTimes.push("Now");
    // console.log('current price of coin', currentPrices[coinSym]);
    finalValues.push(currentPrices[coinSym]);
    // console.log(finalValues);
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
              backgroundColor: 'rgb(255, 99, 132)',
              borderCapStyle: 'butt',
              borderDash:[],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderWidth: 1,
              pointRadius: 1,
              borderColor: 'rgb(255, 99, 132)',
              data: finalValues
          },
          {
            label: "Baseline",
            fill: false,
            borderColor: 'rgb(0, 0, 0)',
            borderDash: [3, 5],
            pointStyle: 'line',
            data: baselineArr,

          }
        ]
      },
    });
  }).catch(function(err){
    console.log(err);
  })
}
