var restler=require('restler')

var url='http://localhost:3091/delay/'
var asciiIx=65
var maxConcurrent=20
var startTime=Date.now()

var countRequests=0, countTimeouts=0, countResponse=0, countError=0
function notCompleted(){ return countRequests-(countTimeouts+countError+countResponse);}

function logStat() {
  console.log(getDeltaTime() + ' ======= Stat: not=' + notCompleted() + ' req=' + countRequests +
              ' res=' + countResponse + ' err=' + countError + ' tim=' + countTimeouts +
             ' ============')
}

// doRequestAndWait(20)
// doRequestAndWait(5)
// doRequestAndWait(3)

var startProc =
    setInterval(function() {
      if (notCompleted() < maxConcurrent) {
        doRequestAndWait(getRandomTimeout())
      }
    }, 1000)

setInterval(function() {
  logStat()
}, 10000)

setTimeout(function() {
  startProc.close()
  console.log('============ Stopping ==============')
}, 1000*60*10)


function doRequestAndWait(deltaTime, name) {
  name = name || getName()
  var timeout=deltaTime*1000 + 3000
  var req = restler.get(url + deltaTime, {timeout: timeout})
  log('Starts');
  countRequests++
  req.on('complete',
         function(result) {
           if (result instanceof Error) {
             countError++
             log('Error:' + result.message)
           } else {
             countResponse++
             log('Result: ' + result)
           }
         })
  req.on('timeout', function(ms) {
    countTimeouts++
    log('Aborted, ms=' + ms)
  })

  function log(x) {
    console.log(getDeltaTime() + ' ' + name + '/' + deltaTime + ': ' + x)
  }

}

function getName() {
  if (asciiIx > 90) asciiIx=65
  return String.fromCharCode(asciiIx++);
}

function getRandomTimeout() {
  return Math.round(Math.random()*70+5)
}

function getDeltaTime() {
  var delta = Math.round((Date.now() - startTime) / 1000)
  var d=new Date(null); d.setSeconds(delta); return d.toISOString().substr(11,8);
}
