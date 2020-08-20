var reasons = [];


function addReason() {
  var input = document.getElementById('new-reason');
  console.log(input.value);
  socket.emit('add-reason',input.value);
  updateReasons();
}

function updateReasons(){
    // get reference to select element
  var sel = document.getElementById('select-option');
  for(var option in reasons) {
    var opt = document.createElement('option');
    opt.appendChild( document.createTextNode(option) );
    opt.value = option;
    sel.appendChild(opt);
  }
}
