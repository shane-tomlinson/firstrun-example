var SERVER_ORIGIN = 'http://127.0.0.1:3030';
var searchParams = new URLSearchParams(window.location.search.replace(/^\?/, ''));
if (searchParams.has('endpoint')) {
  SERVER_ORIGIN = 'https://' + searchParams.get('endpoint') + '.dev.lcip.org';
}
var iframe = document.querySelector('#fxa');
var iframeTarget = iframe.contentWindow;

window.addEventListener('message', function (e) {
  console.log('received a message: ', e.origin);
  console.log('data: ', e.data);
  if (e.origin === SERVER_ORIGIN) {
    var data = JSON.parse(e.data);
    if (data.command === 'ping') {
      iframeTarget.postMessage(e.data, SERVER_ORIGIN);
    } else if (data.command === 'resize') {
      var height = data.data.height;
      var newHeight = height;// + 20;
      iframe.setAttribute('height', newHeight + 'px');
    } else if (data.command === 'form_engaged') {
      removeSkipEl();
      //disableSkipEl();
    } else if (data.command === 'form_disabled') {
      //enableSkipEl();
    } else if (data.command === 'form_enabled') {
      //disableSkipEl();
    } else if (data.command === 'navigated') {
      switch(data.data.url) {
        case 'signin':
        case 'signup':
        case 'reset_password':
          showSkipEl();
          break;
        default:
          removeSkipEl();
          break;
      }
    }
  }
}, true);


function removeSkipEl () {
  const skipEl = document.getElementById('skip');
  if (skipEl) {
    skipEl.style.border = 'none';
    skipEl.style.padding = '0';
    skipEl.style.height = '0';
    skipEl.style.overflow = 'hidden';
  }
}

function showSkipEl () {
  const skipEl = document.getElementById('skip');
  if (skipEl) {
    skipEl.style.border = '';
    skipEl.style.padding = '';
    skipEl.style.height = '';
    skipEl.style.overflow = '';
  }
}

function enableSkipEl () {
  const skipEl = document.getElementById('skip');
  if (skipEl) {
    skipEl.removeAttribute('disabled');
  }
}

function disableSkipEl () {
  const skipEl = document.getElementById('skip');
  if (skipEl) {
    skipEl.setAttribute('disabled', 'disabled');
  }
}

document.getElementById('skip').addEventListener('click', () => {
  alert('skip');
});


var IFRAME_SRC = SERVER_ORIGIN + '/signin?service=sync&haltAfterSignIn=true&context=fx_firstrun_v2&style=chromeless&origin=' + document.location.origin;

iframe.setAttribute('src', IFRAME_SRC);
