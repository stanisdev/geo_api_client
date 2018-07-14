const API_URL = 'http://localhost:4000';

$(() => {
  if (isAuth()) {
    $('#menuAuth, #menuRegistration').remove();
  }
  else {
    $('#menuLogout, #menuCash').remove();
  }
  $('#gMenu').show();
  const routes = {
    '/': 'main',
    '/users/registration': 'usersRegistration',
    '/users/auth': 'usersAuth',
    '/cash/deposit': 'cashDeposit'
  };
  window[routes[window.location.pathname]]();
  logout();
});

/**
 * Main route
 */
function main() {
  $('#sendIP').on('click', () => {
    setTokensHeaders();
    ajax({
      data: {
        ip: $('#ip').val(),
      },
      url: '/',
      method: 'POST',
    }).then((result) => {
      $('#result').text(`${result.data.city}/${result.data.country}`);
    }).catch(queryFailed);
  });
}

/**
 * Registration
 */
function usersRegistration() {
  if (isAuth()) {
    return window.location = '/';
  }
  $('#registration').on('click', () => {
    ajax({
      data: {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        tariff: $('#tariff').val(),
      },
      url: '/users/registration',
      method: 'POST',
    }).then((result) => {
      alert('Регистрация прошла успешно. Авторизуйтесь');
      window.location = '/users/auth';
    }).catch(queryFailed);
  });
}

/**
 * Auth
 */
function usersAuth() {
  if (isAuth()) {
    return window.location = '/';
  }
  $('#auth').on('click', () => {
    ajax({
      data: {
        email: $('#email').val(),
        password: $('#password').val(),
      },
      url: '/users/auth',
      method: 'POST',
    }).then((result) => {
      window.localStorage.setItem('access_token', result.data.access_token);
      window.localStorage.setItem('session_id', result.data.session_id);
      window.location = '/';
    }).catch(queryFailed);
  });
}

/**
 * Logout
 */
function logout() {
  $('#menuLogout').on('click', () => {
    setTokensHeaders();
    ajax({
      url: '/users/logout',
      method: 'GET',
      dataType: 'json',
    }).then((result) => {
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('session_id');
      window.location = '/';
    }).catch(queryFailed);
  });
}

/**
 * Deposit
 */
function cashDeposit() {
  if (!isAuth()) {
    return window.location = '/';
  }
  $('#cashDeposit').on('click', () => {
    setTokensHeaders();
    ajax({
      data: {
        amount: $('#amount').val(),
      },
      url: '/cash/deposit',
      method: 'POST',
    }).then((result) => {
      alert('Успешно!');
    }).catch(queryFailed);
  });
}

function ajax(options) {
  const {data, method, url} = options;
  return new Promise((res, rej) => {
    $.ajax({
      url: API_URL + url,
      method,
      data,
      dataType: 'json',
      success(response) {
        if (response.success === true) {
          $(`.gError`).css('visibility', 'hidden');
          return res(response);
        }
        rej(response);
      },
      error: rej,
    });
  });
}

function queryFailed(err) {
  $('.gRender').text('');
  $(`.gError`).css('visibility', 'hidden');
  if (err instanceof Object && err.success === false && 'errors' in err) { // Server response error
    const {errors} = err;
    switch (errors.type) {
      case 'VALIDATION_ERROR':
        Object.keys(errors.fields).forEach((field) => {
          $(`#${field}_error`).html(errors.fields[field]).css('visibility', 'visible');
        });
        return;
      case 'NOT_AUTHORIZED':
        return alert('Вы не авторизованы');
      case 'PAID_ACCOUNT_EXPIRED':
      case 'FUND_ACCOUNT':
        return alert('У вас недостаточно средств');
      case 'EXCEEDED_REQUESTS_NUMBER_PER_HOUR':
        return alert('Вы превысили допустимое количество запросов в час');
      case 'NOT_FOUND':
        return alert('Вы превысили допустимое количество запросов в час');
        break;
    }
  }
  console.log(err);
  alert('Запрос завершился с ошибкой');
}

function isAuth() {
  const token = window.localStorage.getItem('access_token');
  return typeof token === 'string' && token.length > 0;
}

function setTokensHeaders() {
  if (!isAuth()) {
    return;
  }
  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('x-auth-token', window.localStorage.getItem('access_token'));
      xhr.setRequestHeader('session-id', window.localStorage.getItem('session_id'));
    }
  });
}
