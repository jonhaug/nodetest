var cluster=require('cluster')
var util = require('util')
var names=['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota',' Kappa',' Lambda',' Mu',' Nu',' Xi',' Omicron',' Pi',' Rho',' Sigma',' Tau',' Upsilon',' Phi',' Chi',' Psi',' Omega']
var nextNameIx=0
var startTime=Date.now()

cluster.schedulingPolicy=cluster.SCHED_RR

function getNextName() {
  if (nextNameIx >= names.length) nextNameIx=0
  return names[nextNameIx++]
}

if (cluster.isMaster) {
  workers=[]; var worker
  worker = startWorker(cluster, getNextName()); workers.push(worker)
  worker = startWorker(cluster, getNextName()); workers.push(worker)
  restart_top_worker()

  cluster.on('exit', function(worker, code, signal) {
    log("worker " + worker.process.pid +  ' died with code ' + code + ', signal ' + signal + ' suicide=' + worker.suicide);
    workers.push(startWorker(cluster, getNextName()))
    restart_top_worker();
  })

  function restart_top_worker() {
    setTimeout(function() {
      var worker=workers.shift()
      log('master: trying to restart worker ' + worker.id );
      worker.send({type: 'shutdown', from: 'master'});
    },
               30000)
  }
} else {
  var name=cluster.worker.process.env.name
  log('I am worker ' + cluster.worker.id + ' name=' + name)
  setInterval(()=>{
    log(name + ' ' + process.uptime() + ' ' + process.memoryUsage())
  }, 10000)
  var portal=require('./index');
}


function startWorker(cluster, name) {
  var worker = cluster.fork({name: name, startTime: startTime});
  log('Starting worker, name=' + name + ' pid=' + worker.process.pid);
  return worker;
}
function getDeltaTime() {
  var delta = Math.round((Date.now() - startTime) / 1000)
  var d=new Date(null); d.setSeconds(delta); return d.toISOString().substr(11,8);
}
function log(x) {
  console.log(getDeltaTime() + ' ' + x)
}
function logMemoryUsages(process) {
  var memUsage=process.memoryUsage()
  
}

/**

sendMany() { for DELAY in 2 5 40 1 3 50 2 1; do curl http://localhost:3091/delay/$DELAY & done; }

*/
