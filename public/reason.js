var reasons = [];


function addReason() {
  var input = document.getElementById('new-reason');
  console.log(input.value);
  socket.emit('add-reason',input.value);
}
