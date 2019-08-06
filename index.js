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

// retrieve headlines from today's date -50 years from nyt api
function getOldNews(autoDate) {
  const params = {
    pub_date: autoDate
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
  .then(responseJson => displayAutoResults(responseJson))
  .catch(error => {
    $('#error-message').text(`Something went wrong: ${error.message}`);
  });
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

// display auto results
function displayAutoResults(responseJson) {
  console.log(responseJson);
  $('#error-message').empty();
  $('#auto-title').append(`<h2>50 Years Ago Today: <a id='auto-link' href='${responseJson.response.docs[0].web_url}'>${responseJson.response.docs[0].headline.main}</a></h2>`);
  // for (let i = 0; i < responseJson.response.docs.length; i++) {
  //   $('#auto-link').attr('href', `'${responseJson.response.docs[i].web_url}'`);
  // }
}

// display results
function displayResults(responseJson) {
  console.log(responseJson);
  $('#error-message').empty();
  $('#results').empty();
  for (let i = 0; i < responseJson.response.docs.length; i++) {
    $('#results').append(`<li class='slide-left'><a href='${responseJson.response.docs[i].web_url}'>${responseJson.response.docs[i].headline.main}</a></li>`);
  };
  $('#results-section').removeClass('hidden');
  $('#results-title').text(`Results for ${$('#search-date').val()}`)
  $('#search-date').val('');
  
}

// event listener
function watchForm() {
  $('#search-form').submit(event => {
    event.preventDefault();
    const searchDate = $('#search-date').val();
    getNews(searchDate);
  });
}

// event listener for feature article
function watchPage() {
  $(document).ready(event=> {
    // event.preventDefault();
    let autoDate = null;
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() +1;

    if (date < 10) {
      date = '0' + date;
    } if (month < 10) {
      autoDate = (today.getFullYear() - 50 + '-' + '0' + month + '-' + date);
    } else {
      autoDate = (today.getFullYear() - 50 + '-' + month + '-' + date);
    }
    getOldNews(autoDate);
  });
}

$(watchForm);
$(watchPage);