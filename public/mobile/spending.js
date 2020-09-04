var spendinghistory = [];
// data ~ {reason : spend}
var reasonbreakdown = [];
// data ~ {date : spend}
var datebreakdown = [];
//data ~ {reason : spend}
var week = [];
//total spend for current week
var weektotal = 0;
//this weeks breakdown by reason
var weekreasons = [];
//this weeks breakdown by day
var weekdays = []

var cardhtml = "";
function returnHTMLReasons(amount,mastertext,budget) {
  var percentused = ((amount/budget)*100).toFixed(1);
  var leftover = (budget-amount).toFixed(2);
  return "<div class=\"w3-container\"><div class=\"w3-cell-row\"><h3 class=\"w3-cell\" style=\"width:60%;\">"+mastertext+"</h3><h4 class=\"text-theme w3-cell\" style=\"text-align:right;\">-£"+amount+"</h4></div><div class=\"w3-cell-row\"><p class=\"w3-cell\">"+percentused+"% Used | Remaining:</p><p class=\"w3-cell\" style=\"text-align:right;\">£"+leftover+"</p></div></div><hr>";
}
function returnHTMLWeekdays(amount,mastertext) {
  return "<div class=\"w3-container\">  <div class=\"w3-cell-row\"><h3 class=\"w3-cell\" style=\"width:60%;\">"+mastertext+"</h3><h4 class=\"text-theme w3-cell\" style=\"text-align:right;\">-£"+amount+"</h4>  </div></div><hr>";
}

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  socket.emit('new-transaction',{reason,date,amount,userid});
}

function showTransactions() {
  var weekdaylist = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]; //list of weekdays
  var week_totalspend = document.getElementById('week-totalspend'); // get divs for data input
  var week_byreason = document.getElementById('week-byreason');
  var week_byday = document.getElementById('week-byday');
  week_totalspend.innerHTML = "Spent: £"+weektotal.toFixed(2); //set the week total spend
  week_byreason.innerHTML = "";
  week_byday.innerHTML = "";
  for (var reason in weekreasons) { //loop through the reasons for this week
    var amount = weekreasons[reason]; //get amount for reason
    week_byreason.innerHTML += returnHTMLReasons(amount.toFixed(2),reason,getBudget(reason)); //add html
  }
  for (var x in weekdaylist) { //loop through days in a week
    var amount = 0; //default amount
    var day = weekdaylist[x];
    if(weekdays.hasOwnProperty(day)) { //if money spent on 'day' set amount to the spend
      amount = weekdays[day];
    }
    week_byday.innerHTML += returnHTMLWeekdays(amount.toFixed(2),day); //add html
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

function sortByWeek(date) {
  var thisweek = [];
  var thisweektotal = 0;
  var thisweekreasons = [];
  var thisweekdays = [];
  for(var x in spendinghistory) {
    var obj = spendinghistory[x];
    if(isWeek(obj.date,date)) {
      thisweek.push(obj);
      thisweektotal += obj.amount;
      if (thisweekreasons.hasOwnProperty(obj.reason)) {
        var totals = thisweekreasons[obj.reason]; //total spend for reason so far
        totals+= obj.amount;
        thisweekreasons[obj.reason] = totals;
      } else {
        thisweekreasons[obj.reason] = obj.amount;
      }
      var date = moment(obj.date).format('dddd');
      if (thisweekdays.hasOwnProperty(date)) {
        var totals = thisweekdays[date]; //total spend for date so far
        totals+= obj.amount;
        thisweekdays[date] = totals;
      } else {
        thisweekdays[date] = obj.amount;
      }
    }
  }
  week = thisweek;
  weektotal = thisweektotal;
  weekreasons = thisweekreasons;
  weekdays = thisweekdays;
}

function isThisWeek(d) {
  var result = moment(d).isSame(new Date(), 'week');
  return result;
}
function isWeek(datetocheck,weekdate) {
  var result = moment(datetocheck).isSame(weekdate, 'week');
  return result;
}

function getBudget(reason) {
  var budget;
  for(var i in reasons) {
    if(reasons[i].reason === reason) {
      budget = reasons[i].budget;
    }
  }
  return budget;
}

function updateInfo(weekdate) {
  sortByWeek(weekdate);
  document.getElementById('week-displaying-text').innerHTML = "Showing Week Beginning " + moment(weekdate).format("DD-MM-YYYY");
  showTransactions();
  drawCharts();
}
