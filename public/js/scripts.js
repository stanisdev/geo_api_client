const API_URL = 'http://localhost:4000';

$(() => {
  const routes = {
    '/': 'main',
    '/users/registration': 'usersRegistration'
  };
  window[routes[window.location.pathname]]();
});

/**
 * Main route
 */
function main() {

  $('#sendIP').on('click', () => {
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
        break;
    }
  }
  console.log(err);
  alert('Запрос завершился с ошибкой');
}
