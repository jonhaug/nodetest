# nodetest

This is simple testapplication for clustering. It contains three files:

 * `server.js`: Start a cluster with one master and two workers
 * `index.js`: The code for the workers resides here
 * `client.js` Client code to access the server

The server starts two workers and every 30 seconds sends a shutdown message to the first worker and asks it
to stop. It waits for a signal that it has indeed stopped, and then starts a new worker.

The worker runs the code in `index.js` and is a simple web server running `connect.js`. It receives
requests on the form `http://localhost:3091/delay/SECONDS` where SECONDS is an integer. The web
servers waits that many seconds before it responds to the client. When the worker receives a
shutdown message from the master, it closes down the connect server using http.close() which waits
until all requests are completed, and the stops the process.

The `client.js` code repeatedly sends delay requests to the server and records the responses writing
on the stdout requests, respones, errors and timeouts. The client is hard coded to send requests in
10 minutes with a maximum of 20 simultanously requests. The timeouts vary from 5 to 75 seconds
randomly.

## Howto

Just open two terminal windows and type:

node server.js
node client.js

in the two windows respectively. Watch the output.

If you like, you can also open a browser and enter http://localhost:3091/delay/8 and watch the
server window for action and see that after 8 seconds you get a response. Might be easier if you
don't start the client.js first.

