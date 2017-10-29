let currentPrices = {};

$(document).ready(function () {

  console.log('app.js loaded - sanity check');

  getCurrentPrices(['ETH','BTC','DASH']);


  let $chart = $("#lineChart");
  // console.log($chart);
  let testChart = new Chart($chart, {
    // The type of chart we want to create
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
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
            data: [0, 10, 5, 2, 20, 30, 45],
        },
        {
          label: "baseline",
          fill: false,
          borderColor: 'rgb(0, 0, 0)',
          borderDash: [3, 5],
          pointStyle: 'line',
          data: [13, 13, 13, 13, 13, 13, 13],

        }
      ]
    },
    // Configuration options go here
    options: {}
  });


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
      let selector = `.${sym}Price`;
      $(selector).append(price);
      currentPrices[sym] = price
      newHTML += `<p class=${sym}>Current price of ${sym}: $${price} (USD)</p>`
    })
    $prices.append(newHTML);
    createPriceChart();
  }).catch(function(err){
    console.log(err);
  })
}

function createPriceChart() {
  let $BTC = $('.BTCChart');
  $.ajax({
    method: "GET",
    url: "https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=24&aggregate=3&e=CCCAGG"
  })
  .then(function(prices){
    // console.log('from currentPrices', currentPrices);
    priceArr = prices.Data;
    let priceTimes = priceArr.map((dataPoint) => { return dataPoint.time});
    let priceValues = priceArr.map((dataPoint) => { return dataPoint.open});
    // console.log('times arr', priceTimes);
    // console.log('prices arr', priceValues);
    let baselinePrice = priceValues[19];
    let baselineArr = [baselinePrice, baselinePrice, baselinePrice, baselinePrice, baselinePrice, baselinePrice]
    let finalTimes = priceTimes.slice(20, 25);
    let finalValues = priceValues.slice(20,25);
    finalTimes.push(1509225293);
    finalValues.push(currentPrices.BTC);
    console.log(finalValues);
    let BitcoinChart = new Chart($BTC, {
      // The type of chart we want to create
      type: 'line',
      data: {
          labels: finalTimes,
          datasets: [
            {
              label: "Price of BTC",
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
            label: "Previous Price",
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
