

$(document).ready(function () {

  $('.modal').modal();
  $(".button-collapse").sideNav();
  $(".dropdown-button").dropdown();

  // $('.exchange-form').on('click', handleModalClick);

  console.log('app.js loaded - sanity check');

// End of document ready
})


function handleModalClick(event){
  event.preventDefault();
  // console.log("got to modal click");
  console.log($(this));
  console.log($(this)[0].isValid());
}
