'use strict';

// access New York Times archive API
// and let user for headlines by date
const apiKey = 'Wuo64AKtlhqtUJFBpSwNrkFvZcXygXkf';
const searchUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

// retrieve headlines from today's date -50 years from nyt api
function getOldNews(autoDate) {
  const params = {
    pub_date: autoDate
  };
  const queryString = formatQueryParams(params)
  const url = searchUrl + '?' + queryString + '&' + 'api-key=' + apiKey;

  console.log(url);

  fetch(url)
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(jsonResponse => displayAutoResults(jsonResponse))
  .catch(error => {
    $('#error-message').text(`Something went wrong: ${error.message}`);
  });
}

// retrieve data from nyt api for user search
function getNews(searchDate) {
  const params = {
    pub_date: searchDate
  };
  const queryString = formatQueryParams(params)
  const url = searchUrl + '?' + queryString + '&' + 'api-key=' + apiKey;

  console.log(url);

  fetch(url)
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(jsonResponse => displayResults(jsonResponse))
  .catch(error => {
    $('#error-message').text(`Something went wrong: ${error.message}`);
  });
}

// display auto results
function displayAutoResults(jsonResponse) {
  $('#error-message').empty();
  const headlines = jsonResponse.response.docs;
  for (let item of headlines) {
    const listItem = `<div class='slide'><i class='fas fa-link'></i><a target='_blank' href="${item.web_url}">${item.headline.main}</a></div>`;
    $(listItem).appendTo('#feature-articles');
  }
}

// display search results
function displayResults(jsonResponse) {
  const userSearchDate = $('#search-date').val();
  const dateArray = userSearchDate.split("-");
  const indexOfFirst = dateArray[1].indexOf('0');
  const indexOfSecond = dateArray[2].indexOf('0');
  console.log(jsonResponse);
  $('#error-message').empty();
  $('#results').empty();
  $('#invalid-date').addClass('hidden');
  for (let i = 0; i <jsonResponse.response.docs.length; i++) {
    $('#results').append(`<li class='slide-left'><i class='fas fa-link'></i><a target='_blank' href='${jsonResponse.response.docs[i].web_url}'>${jsonResponse.response.docs[i].headline.main}</a></li>`);
  };
  $('#results-section').removeClass('hidden');
  
  if (indexOfFirst === 0) {
    dateArray[1] = dateArray[1].substr(1);
  } 
  if (indexOfSecond === 0) {
    dateArray[2] = dateArray[2].substr(1);
  } 
  if (jsonResponse.response.docs.length === 0) {
    $('#invalid-date').removeClass('hidden');
  }
  const formattedDate = `${dateArray[1]}-${dateArray[2]}-${dateArray[0]}`;
  $('#results-title').text(`Results for ${formattedDate}`);
  $('#search-date').val('');

}

// format query parameters
function formatQueryParams(params) {
  console.log(params);
  const queryItems = Object.keys(params).map(key => `fq=${key}:${params[key]}`)
  console.log(queryItems);
  return queryItems.join('&');
}

// watch form for submission
function watchForm() {
  $('#search-form').submit(event => {
    event.preventDefault();
    const searchDate = $('#search-date').val();
    getNews(searchDate);
  });
}

// event listener for feature article
function watchPage() {
    // event.preventDefault();
    let autoDate;
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() +1;

    if (date < 10) {
      date = '0' + date;
    } if (month < 10) {
      autoDate = (today.getFullYear() - 50 + `-0${month}-${date}`);
    } else {
      autoDate = (today.getFullYear() - 50 + `'-${month}-${date}`);
    }
    console.log(autoDate);
    getOldNews(autoDate);
};

function startApp() {
  watchPage();
  watchForm();
}

$(startApp);
