// Initialize Chart
function initializeChart(data) {
  var chartData = formatChartData(data);
  drawChart(chartData);
}

const formatChartData = function (data) {
  const chartItems = getChartItems(data);

  const dataWithUniqueName = uniquifyNames(chartItems);

  return [
    {
      key: "unnecessary data",
      values: dataWithUniqueName,
    },
  ];
};

const getChartItems = function (data) {
  const chartItems = [];
  for (const i in data) {
    chartItems.push(data[i]);
  }

  return chartItems;
};

const drawChart = function drawChart(data) {
  nv.addGraph(function () {
    const chart = nv.models
      .discreteBarChart()
      .x(function (d) {
        return d.name;
      })
      .y(function (d) {
        return parseFloat(d.salary);
      })
      .staggerLabels(true);
    d3.select("#chart svg").datum(data).call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
};

//save new item
document.addEventListener("DOMContentLoaded", () => {
  initializeChart(salary_data);
  document
    .getElementById("AddRecord")
    .addEventListener("click", addRecordHandler);
  const btnShowLast = document.getElementById("showLast");
  btnShowLast.addEventListener("click", function showLastHandler(e) {
    showLastItem();
  });
  // --------------

  // -------------
  document
    .getElementById("recordCount")
    .addEventListener("click", function recordCountHandler(e) {
      loadFirebaseData(showRecordCountListener);
    });

  window.setTimeout(function () {
    document
      .getElementById("recordCount")
      .setAttribute("class", "btn btn-success");
  }, 2000);
});

const showRecordCountListener = function (chartItems) {
  showRecordCount(chartItems[0].values);
};

const initialCountListener = function () {
  const itemsObj = JSON.parse(this.responseText);
  const chartItems = getChartItems(itemsObj);
  document.getElementById("initial-count").innerText = chartItems.length;
};

function addRecordHandler() {
  const getName = document.getElementById("name");
  const name = getName.value;
  getName.value = "";
  const mainSalary = document.getElementById("salary");
  const salary = mainSalary.value;
  mainSalary.value = "";
  if (!name || !salary) {
    showDataError(name, salary);
    return;
  }
  addRecord(name, salary);
  secondHandler(name, salary);
}

function addRecord(name, salary) {
  const newItem = getRecord(name, salary);
  const id = Math.ceil(Math.random() * 1000000000);

  salary_data[id] = newItem;
  initializeChart(salary_data);
}

function getRecord(name, salary) {
  const newItem = {
    name: name,
    salary: salary,
  };

  return newItem;
}

const showLastItem = function () {
  const items = salary_data;
  let lastKey;
  for (const key in items) {
    lastKey = key;
  }
  const lastItem = items[lastKey]; // i have to change this area
  const lastRecord = getRecord(lastItem.name, lastItem.salary);
  displayLastItemDialog(lastRecord);
};

const loadFirebaseData = function (resHandler) {
  const data = salary_data;
  const chartData = formatChartData(data);
  resHandler(chartData);
};

const displayLastItemDialog = function (lastItem) {
  const dlg = document.getElementById("dialog-last-item");
  dlg.classList.remove("hide");
  document.getElementById("showName").innerText = lastItem.name;
  document.getElementById("showSalary").innerText = lastItem.salary;
  // document.getElementById("showSalary").innerText = d3.format(",.0f")(
  //   lastItem.salary
  // );
  dlg.dialog({
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};
// -----
const secondHandler = (name, salary) => {
  const newName = name;
  const newSalary = salary;
  console.log(newName, newSalary);
  const addLastOne = document.getElementById("addLastOne");
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" >
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Last Person Details</h5>
      </div>
      <div class="modal-body">
       <h3>${name ? name : "Jhankar Mahbub"}</h3>
       <h3>${newSalary ? newSalary : "53655"}</h3>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  `;
  addLastOne.appendChild(div);
};
// ----
var showDataError = function (name, salary) {
  const dlg = document.getElementById("#dialog-error");
  dlg.classList.remove("hide");

  toggleErrorMessage("#newName", name, "Who the hell you are talking about!");
  toggleErrorMessage("#newSalary", salary, "How much that guy make!");

  dlg.dialog({
    width: 600,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};

function toggleErrorMessage(selector, value, msg) {
  if (value) {
    document.getElementById(selector + "line").style.display = "none";
  } else {
    document.getElementById(selector + "line").style.display = "block";
    document.getElementById(selector).innerText = msg;
  }
}

const showRecordCount = function (data) {
  const dlg = document.getElementById("dialog-record-count");

  dlg.classList.remove("hide");
  console.log(dlg);
  document.getElementById("numberOfRecords").innerText = data.length;

  dlg.dialog({
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      },
    },
  });
};

const anotherRecordCountHandler = function anotherRecordCountHandler(e) {
  console.log("you have extra click handler");
  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 ? "odd" : "even";
    console.log(isEven);
  }
};

function longLineCode() {
  console.log("you have extra click handler");
  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 ? "odd" : "even";
    console.log(isEven);
  }
}

/*
  bad data breaks code. Broken code needs more code to fix.
  and more code means higher job security. So, smile :)



  how it works: 
  we keep track of names in the "uniqueNames" object. 
  
  If a name exists in the uniqueNames object, you got a duplicate. 

  For a duplicate, you will add a white space
  to distinguish it from the previous one

  i hate writing comment. 
  need a coffee break!
*/

const uniquifyNames = function (items) {
  const uniqueNames = {};

  return items.map(function (item) {
    if (uniqueNames[item.name] !== undefined) {
      uniqueNames[item.name] += " ";
      item.name += uniqueNames[item.name];
    } else {
      uniqueNames[item.name] = "";
    }
    return item;
  });
};
