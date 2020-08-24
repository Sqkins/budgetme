var spendinghistory = [];
// data ~ {reason : spend}
var reasonbreakdown = [];
// data ~ {date : spend}
var datebreakdown = [];
//data ~ {reason : spend}
var thisweek = [];

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  socket.emit('new-transaction',{reason,date,amount});
}

function showTransactions() {
  var div = document.getElementById('transactions');
  div.innerHTML = "";
  for(var reason in reasonbreakdown) {
    div.innerHTML += "<p>"+reason+" £"+reasonbreakdown[reason].toFixed(2)+"</p>";
  }
  for(var date in datebreakdown) {
    div.innerHTML += "<p>"+date+" £"+datebreakdown[date].toFixed(2)+"</p>";
  }
}

function sortByReason() {
  var reasonsbd = [];
  for(var x in spendinghistory) {
    var r = spendinghistory[x].reason; //reason at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (reasonsbd.hasOwnProperty(r)) {
      var totals = reasonsbd[r]; //total spend for reason so far
      totals+= s;
      reasonsbd[r] = totals;
    } else {
      reasonsbd[r] = s;
    }
  }
  reasonbreakdown = reasonsbd;
}

function sortByDate() {
  var datesbd = [];
  for(var x in spendinghistory) {
    var d = spendinghistory[x].date; //date at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (datesbd.hasOwnProperty(d)) {
      var totals = datesbd[d]; //total spend for reason so far
      totals+= s;
      datesbd[d] = totals;
    } else {
      datesbd[d] = s;
    }
  }
  datebreakdown = datesbd;
}

function thisWeekSort() {
  var thisweek = [];
  var thisweektotal = 0;
  var thisweekreasons = [];
  for(var x in spendinghistory) {
    var obj = spendinghistory[x];
    if(isThisWeek(obj.date)) {
      thisweek.push(obj);
      thisweektotal =+ obj.amount;
      if (thisweekreasons.hasOwnProperty(obj.reason)) {
        var totals = reasonsbd[obj.reason]; //total spend for reason so far
        totals+= obj.amount;
        thisweekreasons[obj.reason] = totals;
      } else {
        thisweekreasons[obj.reason] = obj.amount;
      }
    }
  }
  console.log(thisweek);
  console.log(thisweektotal);
  console.log(thisweekreasons);
}

function isThisWeek(d) {
  var result = moment(d).isSame(new Date(), 'week');
  return result;
}
