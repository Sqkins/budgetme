google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);
}
var options = {
  title: 'My Daily Activities',
  pieHole: 0.4,
};
var element = document.getElementById('piechart');
console.log(element);
var chart = new google.visualization.PieChart(element);
chart.draw(data, options);
