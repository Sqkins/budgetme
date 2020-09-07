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
      },
      legend: {
          textStyle: { color: '#0d69f2' },
          fontName: 'Verdana'
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
      ['Reason','Spend', {  role: 'annotation'  }, {  role: 'tooltip' }]
    ];
    for(var x in reasons) {
      var r = reasons[x].reason;
      var amount = weekreasons[r];
      if(amount == null) {
        amount = 0;
      }
      array.push([r,amount,'£'+amount.toFixed(2).toString(),'£'+amount.toFixed(2).toString()]);
    }
    var data = google.visualization.arrayToDataTable(array);
    var options = {
      vAxis: {
        title: 'Spend (£)'
      },
      chartArea:{left: 30, right: 60,width:'100%',height:'100%'},
      is3D: true,
      legend: {
          textStyle: { color: '#0d69f2' },
          fontName: 'Verdana'
      }
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('reason_chart'));

    chart.draw(data, options);
  });
}

//create trigger to resizeEnd event     
$(window).resize(function() {
  if(this.resizeTO) clearTimeout(this.resizeTO);
  this.resizeTO = setTimeout(function() {
      $(this).trigger('resizeEnd');
  }, 500);
});

//redraw graph when window resize is completed  
$(window).on('resizeEnd', function() {
  drawReasonChart();
  drawWeekdayChart();
});
