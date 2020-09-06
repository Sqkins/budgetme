function toggleDropDown(idtoshow) {
    var x = document.getElementById(idtoshow);
    console.log(idtoshow);
    x.classList.toggle("w3-show");
}

function openPage(pageName, element) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("theme-d1");
    }
    element.classList.add("theme-d1");

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
}
document.getElementById("defaulttab").click();

function setlastweek() {
    var weekpicker = document.getElementById('week-selector');
    weekpicker.value = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    //updateInfo(weekpicker.value);
    document.getElementById('week-displaying-text').innerHTML = "Showing Last Week";
}

function setthisweek() {
    var weekpicker = document.getElementById('week-selector');
    weekpicker.value = moment().subtract(0, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    //updateInfo(weekpicker.value);
    document.getElementById('week-displaying-text').innerHTML = "Showing This Week";
}
document.getElementById("thisweekbutton").click();
var weekpicker = document.getElementById('week-selector');
weekpicker.addEventListener('change', (event) => {
    console.log('sorting by', event.target.value);
    var date = event.target.value;
    event.target.value = moment(date).subtract(0, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    document.getElementById('week-displaying-text').innerHTML = `Showing Week ${event.target.value}`;
    //updateInfo(date);
});

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

createBudgetElement(50, "Food Shop", 1, document.getElementById('budgetcontainer'));


function createBudgetElement(currentBudget, reason, id, parentelement) {
    var divwrapper = document.createElement("div");
    divwrapper.classList.add("container");

    var row1 = document.createElement("div");
    row1.classList.add("w3-cell-row");

    var h3 = document.createElement("h3");
    addClasses(h3, ["w3-cell", "text-theme"]);
    h3.innerHTML = reason;

    var p = document.createElement("p");
    addClasses(p, ["w3-cell"]);
    p.innerHTML = `Budget: £${currentBudget}`;
    p.setAttribute("style", "text-align: right;")

    row1.appendChild(h3); //append children to row class
    row1.appendChild(p);
    console.log(row1);

    var row2 = document.createElement("div");
    row2.classList.add("w3-cell-row");

    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("style", "width:80%;");
    input.setAttribute("placeholder", "Change Budget");
    input.setAttribute("id", `budget${id}`);
    addClasses(input, ["w3-cell", "text-theme", "w3-input"]);

    var button = document.createElement("button");
    button.innerHTML = "Go"
    button.setAttribute("style", "width:20%;");
    addClasses(button, ["w3-cell", "theme", "w3-button"]);

    row2.appendChild(input); //append children to row class
    row2.appendChild(button);
    console.log(row2);

    divwrapper.appendChild(row1);
    divwrapper.appendChild(row2);

    parentelement.appendChild(divwrapper);
    var hr = document.createElement("hr");
    parentelement.appendChild(hr);
}

function createWeekdayElement(spend, day, parentelement) {
    var divwrapper = document.createElement("div");
    divwrapper.classList.add("container");

    var h1 = document.createElement("h1");
    addClasses(h1, ["inline", "text-theme"]);
    h1.innerHTML = day;

    var h3 = document.createElement("h3");
    addClasses(h3, ["inline", "center-v", "right"]);
    h3.innerHTML = `£${spend}`;

    divwrapper.appendChild(h1);
    divwrapper.appendChild(h3);

    parentelement.appendChild(divwrapper);
    var hr = document.createElement("hr");
    parentelement.appendChild(hr);
}

function addClasses(element, classes) {
    classes.forEach(function (c) {
        element.classList.add(c);
    });
}