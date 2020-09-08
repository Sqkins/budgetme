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
    updateInfo(weekpicker.value);
    document.getElementById('week-displaying-text').innerHTML = "Showing Last Week";
}

function setthisweek() {
    var weekpicker = document.getElementById('week-selector');
    weekpicker.value = moment().subtract(0, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    updateInfo(weekpicker.value);
    document.getElementById('week-displaying-text').innerHTML = "Showing This Week";
}
document.getElementById("thisweekbutton").click();
var weekpicker = document.getElementById('week-selector');
weekpicker.addEventListener('change', (event) => {
    console.log('sorting by', event.target.value);
    var date = event.target.value;
    event.target.value = moment(date).subtract(0, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    document.getElementById('week-displaying-text').innerHTML = `Showing Week ${event.target.value}`;
    updateInfo(date);
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
    row1.setAttribute("id", `container${id}`);

    var h3 = document.createElement("h3");
    addClasses(h3, ["w3-cell", "text-theme"]);
    h3.innerHTML = reason;

    var subdiv = document.createElement("div");
    subdiv.setAttribute("class", "w3-cell");
    var p = document.createElement("p");
    p.innerHTML = `Budget: £${currentBudget}`;
    p.setAttribute("style", "text-align: right;")

    var a = document.createElement('a');
    a.innerHTML = 'Delete';
    a.setAttribute("onclick", `deleteReason('container${id}')`);
    a.setAttribute("class", "delete-button");

    row1.appendChild(h3); //append children to row class
    subdiv.appendChild(a);
    subdiv.appendChild(p);
    row1.appendChild(subdiv);


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
    button.setAttribute("onclick", `editBudget('budget${id}')`)
    addClasses(button, ["w3-cell", "theme", "w3-button"]);

    row2.appendChild(input); //append children to row class
    row2.appendChild(button);

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

function createReasonElement(spend, reason, budget, parentelement) {
    var percentused = ((spend / budget) * 100).toFixed(1);
    var leftover = (budget - spend).toFixed(2);

    var divwrapper = document.createElement("div");
    divwrapper.classList.add("container");

    var row1 = document.createElement("div");
    row1.classList.add("w3-cell-row");

    var h1 = document.createElement("h1");
    addClasses(h1, ["w3-cell", "text-theme"]);
    h1.setAttribute("style", "width: 60%;")
    h1.innerHTML = reason;

    var h3 = document.createElement("h3");
    addClasses(h3, ["w3-cell"]);
    h3.innerHTML = `-£${spend}`;
    h3.setAttribute("style", "text-align: right;")

    row1.appendChild(h1); //append children to row class
    row1.appendChild(h3);

    var row2 = document.createElement("div");
    row2.classList.add("w3-cell-row");

    var p1 = document.createElement("p");
    addClasses(p1, ["w3-cell"]);
    p1.innerHTML = `${percentused}% Used | Remaining:`;

    var p2 = document.createElement("p");
    addClasses(p2, ["w3-cell"]);
    p2.innerHTML = `£${leftover}`;

    row2.appendChild(p1); //append children to row class
    row2.appendChild(p2);

    divwrapper.appendChild(row1);
    divwrapper.appendChild(row2);

    parentelement.appendChild(divwrapper);
    var hr = document.createElement("hr");
    parentelement.appendChild(hr);
}

function addClasses(element, classes) {
    classes.forEach(function (c) {
        element.classList.add(c);
    });
}




function addDefaultReasons() {
    var defaultreasons = [{
            reason: "Food Shop",
            budget: 30
        },
        {
            reason: "Gifts",
            budget: 5
        },
        {
            reason: "Eating Out",
            budget: 15
        },
        {
            reason: "Fast Food",
            budget: 30
        },
        {
            reason: "Leisure",
            budget: 10
        },
        {
            reason: "Repairs",
            budget: 30
        },
        {
            reason: "Clothing",
            budget: 10
        }
    ];
    for (var x in defaultreasons) {
        var reason = defaultreasons[x].reason;
        var budget = defaultreasons[x].budget;
        console.log({
            reason,
            budget,
            userid
        });
        socket.emit('add-reason', {
            reason,
            budget,
            userid
        });
    }
    updateReasons();
}

function createNoReasonsHTML() {
    var holder = document.getElementById("noreasonstab");
    var br = document.createElement("br");
    holder.appendChild(br);

    var wrapper = document.createElement("div");
    addClasses(wrapper, ["w3-alert", "border-theme", "w3-round-xlarge", "w3-container"]);

    var span = document.createElement("span");
    addClasses(span, ["w3-button", "theme", "w3-right"]);
    span.setAttribute("onclick", "this.parentElement.style.display='none'");
    span.setAttribute("style", "border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;");
    span.innerHTML = "&times;";

    var h5 = document.createElement("h5");
    h5.innerHTML = "You don't have any reasons yet... get started with some generic ones.";
    var p = document.createElement("p");
    p.innerHTML = "You can always edit or remove them later.";

    var button = document.createElement("button");
    addClasses(button, ["theme", "w3-button"]);
    button.setAttribute("style", "border-top-left-radius: 10px;border-top-right-radius: 10px;");
    button.setAttribute("onclick", "addDefaultReasons();");
    button.innerHTML = "Let's Go"

    wrapper.appendChild(span);
    wrapper.appendChild(h5);
    wrapper.appendChild(p);
    wrapper.appendChild(button);
    holder.appendChild(wrapper);
}