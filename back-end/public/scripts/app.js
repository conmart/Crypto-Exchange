$(document).ready(function () {

  $('.modal').modal();

  console.log('app.js loaded - sanity check');

// End of document ready
})


function setCurrentPrices(){
  $.ajax({
    method: "GET",
    url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,ZEC,DASH&tsyms=USD"
  })
  .then(function(prices){
    let sentPrices = {};
    sentPrices.bitcoin = prices.BTC.USD;
    sentPrices.ethereum = prices.ETH.USD;
    sentPrices.zcash = prices.ZEC.USD;
    sentPrices.dash = prices.DASH.USD;
    // console.log('sending prices', sentPrices);
    $.ajax({
      method: "POST",
      url: "setprices",
      data: sentPrices
    })
    .then(function(response){
      // console.log("received resonponse", response);
    }).catch(function(err){
      console.log(err);
    })
  }).catch(function(err){
    console.log(err);
  })
}

setCurrentPrices();
