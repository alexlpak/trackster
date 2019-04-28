var Trackster = {};

$(document).ready(function(){

  // Search on Button Click
  $('#submit').click(function(){
    $('#trackList').empty();
    var search = $('#search').val();
    Trackster.searchTracksByTitle(search);
    $('#search').blur();
  });

  // Search on Enter
  $('#search').keypress(function(e){
    if (e.which == 13) {
      $('#trackList').empty();
      var search = $('#search').val();
      Trackster.searchTracksByTitle(search);
      $('#search').blur();
    }
  });

  // Clear Current Input
  $("#search").on("focus", function() {
      $("#search").val("");
  });



});

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  var sortArray = [];
  for (i = 0; i < tracks.length; i++) {

    var coverArt = tracks[i].image[1]["#text"];
    var trackName = tracks[i].name;
    var trackArtist = tracks[i].artist;
    var trackListeners = tracks[i].listeners.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var link = tracks[i].url;

    // Store Content into Objects
    var sortObjects = {
      link: link,
      trackName: trackName,
      trackArtist: trackArtist,
      trackListeners: trackListeners,
      coverArt: coverArt
    };
    console.log(sortObjects['link']);

    // Push Objects into Array
    sortArray.push(sortObjects);

    // If no cover art, display this.
    if (coverArt === '') {
      coverArt = './resources/images/unavailable.jpg';
    }

    // This creates new entry in table.
    var htmlTrackRow =
    `<div class="container-fluid flex-container ai-center" id="content">
      <div class="col-xs-1 col-xs-offset-1">
        <a target="_blank" href="${link}">
          <i class="far fa-play-circle" id="play"></i>
        </a>
      </div>
      <span class="col-xs-4">${trackName}</span>
      <span class="col-xs-2">${trackArtist}</span>
      <div class="col-xs-2">
        <img src="${coverArt}">
      </div>
      <span class="col-xs-2">${trackListeners}</span>
    </div>`;

    // Append Changes to HTML
    $('#trackList').append(htmlTrackRow);
  };

function appendToDOM(array) {
  for (i = 0; i < array.length; i++) {
    var htmlTrackRow =
    `<div class="container-fluid flex-container ai-center" id="content">
      <div class="col-xs-1 col-xs-offset-1">
        <a target="_blank" href="`+ array[i].name + `">
          <i class="far fa-play-circle" id="play"></i>
        </a>
      </div>
      <span class="col-xs-4">` + array[i].trackName + `</span>
      <span class="col-xs-2">` + array[i].trackArtist + `</span>
      <div class="col-xs-2">
        <img src="` + array[i].coverArt + `">
      </div>
      <span class="col-xs-2">` + array[i].trackListeners + `</span>
    </div>`;

    // Append Changes to HTML
    $('#trackList').append(htmlTrackRow);
  };
}

  // Sort Songs
  $('#song').click(function() {
    $('#trackList').empty();
    sortAsc(sortArray, 'trackName');
    appendToDOM(sortArray);
  });

  // Sort Artists
  $('#artist').click(function() {
    $('#trackList').empty();
    sortAsc(sortArray, 'trackArtist');
    appendToDOM(sortArray);
  });
  // Sort Artwork
  $('#artwork').click(function() {
    $('#trackList').empty();
    sortAsc(sortArray, 'coverArt');
    appendToDOM(sortArray);
  });
  // Sort Listeners
  $('#listeners').click(function() {
    $('#trackList').empty();
    sortAsc(sortArray, 'trackListeners');
    appendToDOM(sortArray);
  });

  function sortAsc(array, item) {
    array.sort(function(a, b){
      console.log(item);
      var nameA = a[item].toLowerCase(), nameB = b[item].toLowerCase();
      if (nameA < nameB) { // Ascending
        return -1;
      };
      if (nameA > nameB) {
        return 1;
      };
      return 0; //default return value (no sorting)
    });
  };

  function sortDesc(array, item) {
    array.sort(function(a, b){
      console.log(item);
      var nameA = a[item].toLowerCase(), nameB = b[item].toLowerCase();
      if (nameA > nameB) { // Ascending
        return -1;
      };
      if (nameA > nameB) {
        return 1;
      };
      return 0; //default return value (no sorting)
    });
  };

};

// If results are empty, display graphic and message to user.
function empty(data) {
  // Empty
  var empty =
  `<div class="empty flex-container ai-center jc-center fd-column">
    <img src="./resources/images/unicorn.svg" alt="" id="unicorn">
    <span>Oops! Looks like what you're looking for is really rare!</span>
  </div>`;

  if (data.results["opensearch:totalResults"] == 0) {
    $('#trackList').append(empty);
  }
}

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  const API_KEY = '49a4c1e4208661927b34dbe5fea78b8c';
  $.ajax({
    url: 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + title + '&api_key=' + API_KEY + '&format=json',
    datatype: 'jsonp',
    success: function(data) {
      Trackster.renderTracks(data.results.trackmatches.track);
      console.log(data);
      empty(data);
    }
  });
};
