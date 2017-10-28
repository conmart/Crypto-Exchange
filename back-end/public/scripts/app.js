$(document).ready(function () {

  console.log('app.js loaded - sanity check');

  let $chart = $("#lineChart");
  console.log($chart);
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

createPriceChart();
getCurrentPrices(['ETH','BTC','DASH']);

// End of document ready
})


function getCurrentPrices(arr){
  whichCoins = arr.join(',');
  $prices = $('.display-prices');
  pricesUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${whichCoins}&tsyms=USD`
  $.ajax({
    method: "GET",
    url: pricesUrl
  })
  .then(function(prices) {
    newHTML = ''
    arr.forEach((sym) => {
      let price = prices[sym].USD
      newHTML += `<p class=${sym}>Current price of ${sym}: $${price} (USD)</p>`
    })
    $prices.append(newHTML);

  }).catch(function(err){
    console.log(err);
  })
}

function createPriceChart() {
  $.ajax({
    method: "GET",
    url: "https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=24&aggregate=3&e=CCCAGG"
  })
  .then(function(prices){
    console.log(prices);
    console.log(prices.Data);
  }).catch(function(err){
    console.log(err);
  })
}
