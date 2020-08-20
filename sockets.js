var socket = io.connect('http://134.122.109.226:80');

socket.on('reasons-data',function(data) {
  console.log(data);
  reasons = data;
});
