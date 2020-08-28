var reasons = [];


function addReason() {
  var input = document.getElementById('new-reason');
  socket.emit('add-reason',input.value);
  updateReasons();
}

function returnHTMLBudget(id,mastertext,budget) {
  return "<div class=\"w3-container\"><div class=\"w3-cell-row\"><h3 class=\"w3-cell\" style=\"width:60%;\">"+mastertext+"</h3><h4 class=\"text-theme w3-cell\" style=\"text-align:right;\">Budget:"+budget+"</h4>  </div><div class=\"w3-cell-row\"><input class=\"w3-cell w3-input w3-twothird w3-border\" id=\"budget"+id+"\" type=\"number\" step=\"0.01\"><button class=\"w3-btn w3-cell theme w3-third\" onclick=\"editBudget(\'budget"+id+"\');\">Submit</button></div></div><hr>";
}

function updateReasons(){
    // get reference to select element
  var sel = document.getElementById('options');
  var editbudgetpanel = document.getElementById('budget-panel');
  for(var option in reasons) {
    var  reason = reasons[option];
    var opt = document.createElement('option');
    opt.appendChild( document.createTextNode(reason.reason) );
    opt.value = reason.reason;
    sel.appendChild(opt);


    var text = returnHTMLBudget(reason.id,reason.reason,reason.budget);
    editbudgetpanel.innerHTML+= text;
  }
}

function editBudget(idstring) {
  var index = parseInt(idstring.substring(6));
  var budget = parseInt(document.getElementById(idstring).value);
  var reason;
  for(var i in reasons) {
    if(reasons[i].id === index) {
      reason = reasons[i].reason;
    }
  }
  socket.emit('edit-budget',{reason,budget});
}
