function drawCharts() {
  drawWeekdayChart();drawReasonChart();
}
function drawWeekdayChart() {
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(function() {
    var weekdaylist = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    var array = [
      ['Weekday','Spend', { role: 'style' }, {  role: 'annotation'  }]
    ];
    for(var day in weekdaylist) {
      var amount = weekdays[weekdaylist[day]];
      if(amount == null) {
        amount = 0;
      }
      array.push([weekdaylist[day],amount,'0d69f2','£'+amount.toFixed(2).toString()])
    }
    var data = google.visualization.arrayToDataTable(array);
    var options = {
      vAxis: {
        title: 'Spend (£)'
      }
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById('weekday_chart'));

    chart.draw(data, options);
  });
}

function drawReasonChart() {
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(function() {
    var array = [
      ['Reason','Spend', {  role: 'annotation'  }]
    ];
    for(var x in reasons) {
      var r = reasons[x].reason;
      var amount = weekreasons[r];
      if(amount == null) {
        amount = 0;
      }
      array.push([r,amount,'£'+amount.toFixed(2).toString()]);
    }
    var data = google.visualization.arrayToDataTable(array);
    var options = {
      vAxis: {
        title: 'Spend (£)'
      }
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('reason_chart'));

    chart.draw(data, options);
  });
}
