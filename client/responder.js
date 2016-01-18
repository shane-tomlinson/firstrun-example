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
    }
  }
}, true);

var IFRAME_SRC = SERVER_ORIGIN + '/?service=sync&context=iframe&style=chromeless&utm_campaign=spring2015&entrypoint=firstrun';

iframe.setAttribute('src', IFRAME_SRC);

