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
      //removeSkipEl();
      //disableSkipEl();
    } else if (data.command === 'form_disabled') {
      enableSkipEl();
    } else if (data.command === 'form_enabled') {
      disableSkipEl();
    } else if (data.command === 'login') {
      document.location.href = `${SERVER_ORIGIN}/settings`;
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
    skipEl.style.display = 'none';
    /*skipEl.style.border = 'none';
    skipEl.style.padding = '0';
    skipEl.style.height = '0';
    skipEl.style.overflow = 'hidden';*/
  }
}

function showSkipEl () {
  const skipEl = document.getElementById('skip');
  if (skipEl) {
    skipEl.style.display = 'block';
    /*
    skipEl.style.border = '';
    skipEl.style.padding = '';
    skipEl.style.height = '';
    skipEl.style.overflow = '';
    */
    enableSkipEl();

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

const skipEl = document.getElementById('skip');
if (skipEl) {
  skipEl.addEventListener('click', () => {
    alert('skip');
  });
}



const country = encodeURIComponent(iframe.getAttribute('data-country') || 'US');
const forceExperiment = encodeURIComponent(iframe.getAttribute('data-forceExperiment'));
const forceExperimentGroup = encodeURIComponent(iframe.getAttribute('data-forceExperimentGroup') || 'treatment');
const pathname = iframe.getAttribute('data-pathname');

const IFRAME_SRC = SERVER_ORIGIN + `/${pathname}?service=sync&haltAfterSignIn=true&context=fx_firstrun_v2&style=chromeless&country=${country}&forceExperiment=${forceExperiment}&forceExperimentGroup=${forceExperimentGroup}&origin=${document.location.origin}`;

iframe.setAttribute('src', IFRAME_SRC);//'http://127.0.0.1:3030');
