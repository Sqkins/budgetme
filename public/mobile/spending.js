var spendinghistory = [];
// data ~ {reason : spend}
var reasonbreakdown = [];
// data ~ {date : spend}
var datebreakdown = [];
//data ~ {reason : spend}
var period = [];
//total spend for current week
var periodreasons = 0;
//this weeks breakdown by reason
var periodreasons = [];
//this weeks breakdown by day
var weekdays = [];
//values = Week Month
var periodtype = "Week"

function togglePeriod() {
  if (periodtype === "Week") {
    periodtype = "Month";
  } else {
    periodtype = "Week";
  }
  updateInfo(moment().format('YYYY-MM-DD'));
}



var cardhtml = "";

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  socket.emit('new-transaction', {
    reason,
    date,
    amount,
    userid
  });
}

function showTransactions() {
  var weekdaylist = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; //list of weekdays
  var week_totalspend = document.getElementById('week-totalspend'); // get divs for data input
  var week_byreason = document.getElementById('week-byreason');
  var week_byday = document.getElementById('week-byday');
  week_totalspend.innerHTML = "£" + periodtotal.toFixed(2); //set the week total spend
  week_byreason.innerHTML = "";
  week_byday.innerHTML = "";
  for (var reason in periodreasons) { //loop through the reasons for this week
    var amount = periodreasons[reason]; //get amount for reason
    createReasonElement(amount.toFixed(2), reason, getBudget(reason), document.getElementById("week-byreason"))
  }
  for (var x in weekdaylist) { //loop through days in a week
    var amount = 0; //default amount
    var day = weekdaylist[x];
    if (weekdays.hasOwnProperty(day)) { //if money spent on 'day' set amount to the spend
      amount = weekdays[day];
    }
    createWeekdayElement(amount.toFixed(2), day, document.getElementById("week-byday"));
  }
}

function sortByPeriod(date) {
  var thisperiod = [];
  var thisperiodtotal = 0;
  var thisperiodreasons = [];
  var thisweekdays = [];
  if (periodtype === "Week") {
    for (var x in spendinghistory) {
      var obj = spendinghistory[x];
      if (isWeek(obj.date, date)) {
        thisperiod.push(obj);
        thisperiodtotal += obj.amount;
        if (thisperiodreasons.hasOwnProperty(obj.reason)) {
          var totals = thisperiodreasons[obj.reason]; //total spend for reason so far
          totals += obj.amount;
          thisperiodreasons[obj.reason] = totals;
        } else {
          thisperiodreasons[obj.reason] = obj.amount;
        }
        var datestring = moment(obj.date).format('dddd');
        if (thisweekdays.hasOwnProperty(datestring)) {
          var totals = thisweekdays[datestring]; //total spend for date so far
          totals += obj.amount;
          thisweekdays[datestring] = totals;
        } else {
          thisweekdays[datestring] = obj.amount;
        }
      }
    }
  }
  if (periodtype === "Month") {
    var totalWeekdayTransactions = [];
    for (var x in spendinghistory) {
      var obj = spendinghistory[x];
      if (isMonth(obj.date, date)) {
        thisperiod.push(obj);
        thisperiodtotal += obj.amount;
        if (thisperiodreasons.hasOwnProperty(obj.reason)) {
          var totals = thisperiodreasons[obj.reason]; //total spend for reason so far
          totals += obj.amount;
          thisperiodreasons[obj.reason] = totals;
        } else {
          thisperiodreasons[obj.reason] = obj.amount;
        }
      }
    }
  }
  period = thisperiod;
  periodtotal = thisperiodtotal;
  periodreasons = thisperiodreasons;
  weekdays = thisweekdays;
}

function sortByReason() {
  var reasonsbd = [];
  for (var x in spendinghistory) {
    var r = spendinghistory[x].reason; //reason at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (reasonsbd.hasOwnProperty(r)) {
      var totals = reasonsbd[r]; //total spend for reason so far
      totals += s;
      reasonsbd[r] = totals;
    } else {
      reasonsbd[r] = s;
    }
  }
  reasonbreakdown = reasonsbd;
}

function sortByDate() {
  var datesbd = [];
  for (var x in spendinghistory) {
    var d = spendinghistory[x].date; //date at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (datesbd.hasOwnProperty(d)) {
      var totals = datesbd[d]; //total spend for reason so far
      totals += s;
      datesbd[d] = totals;
    } else {
      datesbd[d] = s;
    }
  }
  datebreakdown = datesbd;
}
/*
function sortByWeek(date) {
  var thisweek = [];
  var thisperiodtotal = 0;
  var thisperiodreasons = [];
  var thisweekdays = [];
  for (var x in spendinghistory) {
    var obj = spendinghistory[x];
    if (isWeek(obj.date, date)) {
      thisweek.push(obj);
      thisperiodtotal += obj.amount;
      if (thisperiodreasons.hasOwnProperty(obj.reason)) {
        var totals = thisperiodreasons[obj.reason]; //total spend for reason so far
        totals += obj.amount;
        thisperiodreasons[obj.reason] = totals;
      } else {
        thisperiodreasons[obj.reason] = obj.amount;
      }
      var datestring = moment(obj.date).format('dddd');
      if (thisweekdays.hasOwnProperty(datestring)) {
        var totals = thisweekdays[datestring]; //total spend for date so far
        totals += obj.amount;
        thisweekdays[datestring] = totals;
      } else {
        thisweekdays[datestring] = obj.amount;
      }
    }
  }
  week = thisweek;
  periodtotal = thisperiodtotal;
  periodreasons = thisperiodreasons;
  weekdays = thisweekdays;
} */

function isThisWeek(d) {
  var result = moment(d).isSame(new Date(), 'week');
  return result;
}

function isMonth(datetocheck, monthdate) {
  var result = moment(datetocheck).isSame(monthdate, 'month');
  return result;
}

function isWeek(datetocheck, weekdate) {
  var result = moment(datetocheck).isSame(weekdate, 'week');
  return result;
}

function getBudget(reason) {
  var budget;
  for (var i in reasons) {
    if (reasons[i].reason === reason) {
      budget = reasons[i].budget;
    }
  }
  return budget;
}

function updateInfo(date) {
  sortByPeriod(date);
  document.getElementById('week-displaying-text').innerHTML = `Showing ${periodtype} Beginning ${moment(date).format("DD-MM-YYYY")}`;
  showTransactions();
  drawCharts();
}