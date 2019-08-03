'use strict';

const apiKey = 'Wuo64AKtlhqtUJFBpSwNrkFvZcXygXkf';

const searchURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

// format query parameters
function formatQueryParams(params) {
  console.log(params);
  const queryItems = Object.keys(params).map(key => `fq=${key}:${params[key]}`)
  console.log(queryItems);
  return queryItems.join('&');
}

// retrieve data from nyt api
function getNews(searchDate) {
  const params = {
    pub_date: searchDate
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString + '&' + 'api-key=' + apiKey;

  console.log(url);

  fetch(url)
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => displayResults(responseJson))
  .catch(error => {
    $('#error-message').text(`Something went wrong: ${error.message}`);
  });
}

// display results
function displayResults(responseJson) {
  console.log(responseJson);
  $('#error-message').empty();
  $('#results').empty();
  
}

// event listener
function watchForm() {
  $('#search-form').submit(event => {
    event.preventDefault();
    const searchDate = $('#search-date').val();
    getNews(searchDate);
  });
}

$(watchForm);