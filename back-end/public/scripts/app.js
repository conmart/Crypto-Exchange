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
          borderColor: 'rgb(255, 255, 255)',
          borderDash: [3, 3],
          pointStyle: 'line',
          data: [15, 15, 15, 15, 15, 15, 15],

        }
      ]
    },

    // Configuration options go here
    options: {}
  });

})
