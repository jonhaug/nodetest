var connect=require('connect'),
    http = require('http');

var server
var pid=process.pid
var request_counter=0
var startTime = process.env.startTime || Date.now()
var counter=0
var name = process.env.name


function getDeltaTime() {
  var delta = Math.round((Date.now() - startTime) / 1000)
  var d=new Date(null); d.setSeconds(delta); return d.toISOString().substr(11,8);
}

function log(x, localId) {
  console.log(getDeltaTime() + ' (' + name + ':' + pid + ': count=' +  request_counter + ' id=' + localId + ') ' + x)
}

process.on('message', function(message) {
  log('Receiving message: ' + message.type );
  if (message.type === 'shutdown') {
    log('shutting down...')
    server.close(function() {
      log('closed')
      process.exit();
    })
  }
});

var app = connect();
app.use(function(req, res, next) {
  if (req.url=='/favicon.ico') { return;}
  var local_counter = counter++;
  request_counter++;
  var sess = req.session;
  var secs=0;
  if (req.url.match(/^\/delay/)) {
    var arr=req.url.split(/\//);
    secs= parseInt(arr[2])
  }
  log(req.url, local_counter);
  var timeoutIx=setTimeout(function() {
    res.end('Done waiting ' + secs + ' seconds');
    request_counter--;
    log(req.url + ' done', local_counter);
  }, 1000*secs);
});

server = http.createServer(app).listen(3091);
log('Server started: ')
