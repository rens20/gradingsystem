// Event listener to ensure that the DOM content is fully loaded before executing the function
document.addEventListener("DOMContentLoaded", function () {
  // Call the function to load table data
  loadTableData();
});

// Function to add a new grade to the table
function addGrade() {
  // Get the full name from the input field
  var fullName = document.getElementById("studentName").value;

  // Validate the name format
  if (!fullName || fullName.split(" ").length < 2) {
    alert(
      'Invalid name format. Please enter the name as "Last Name, First Name, Initial".'
    );
    return;
  }

  // Extract components of the name
  var lastName = fullName.split(" ")[0].trim();
  var firstName = fullName.split(" ")[1].trim();
  var initial = fullName.split(" ")[2] ? fullName.split(" ")[2].trim()[0] : "";

  // Get scores from input fields and calculate total score
  var quiz = parseInt(document.getElementById("quiz").value) || 0;
  var pt = parseInt(document.getElementById("pt").value) || 0;
  var exam = parseInt(document.getElementById("exam").value) || 0;
  var totalScore = quiz + pt + exam;

  // Access the table and insert a new row
  var table = document.getElementById("gradeTable");
  var row = table.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);

  // Populate cells with data
  cell1.innerHTML =
    '<span class="editable">' +
    lastName +
    ", " +
    firstName +
    ", " +
    initial +
    "</span>";
  cell2.innerHTML = '<span class="editable">' + quiz + "</span>";
  cell3.innerHTML = '<span class="editable">' + pt + "</span>";
  cell4.innerHTML = '<span class="editable">' + exam + "</span>";
  cell5.innerHTML =
    '<span class="editable" style="color: ' +
    getColorForTotalScore(totalScore) +
    ';">' +
    totalScore +
    "</span>";
  cell6.innerHTML =
    '<button onclick="editGrade(this)">Edit</button>  <button onclick="removeGrade(this)">Remove</button>';

  // Sort the table after adding a new row
  sortTable();

  // Save the updated data to local storage
  saveTableData();

  // Reset the form after adding a grade
  document.getElementById("gradeForm").reset();
}

// Function to remove a grade from the table
function removeGrade(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);

  // Save the updated data to local storage
  saveTableData();
}

// Function to save the table data to local storage
function saveTableData() {
  var tableData = [];
  var tableRows = document.getElementById("gradeTable").rows;

  for (var i = 1; i < tableRows.length; i++) {
    var rowData = [];
    for (var j = 0; j < tableRows[i].cells.length; j++) {
      rowData.push(tableRows[i].cells[j].innerHTML);
    }
    tableData.push(rowData);
  }

  localStorage.setItem("gradeData", JSON.stringify(tableData));
}

// Function to load table data from local storage
function loadTableData() {
  var storedData = localStorage.getItem("gradeData");

  if (storedData) {
    var tableData = JSON.parse(storedData);
    var table = document.getElementById("gradeTable");

    for (var i = 0; i < tableData.length; i++) {
      var row = table.insertRow(-1);

      for (var j = 0; j < tableData[i].length; j++) {
        var cell = row.insertCell(j);
        cell.innerHTML = tableData[i][j];
      }
    }
  }
}

// Function to sort the table based on the first column (names)
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("gradeTable");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[0].innerHTML.toLowerCase();
      y = rows[i + 1].getElementsByTagName("TD")[0].innerHTML.toLowerCase();

      if (x > y) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

// Function to switch to edit mode for a grade
function editGrade(button) {
  var row = button.parentNode.parentNode;

  // Convert cells to editable spans for editing
  for (var i = 1; i < row.cells.length - 1; i++) {
    var content = row.cells[i].innerText;
    row.cells[i].innerHTML = '<span class="editable">' + content + "</span>";
  }

  // Change button text and behavior to save changes
  button.innerText = "Save";
  button.onclick = function () {
    saveEditedGrade(row, button);
  };
}

// Function to save the edited grade and switch back to view mode
function saveEditedGrade(row, button) {
  // Save edited content and revert to non-editable spans
  for (var i = 1; i < row.cells.length - 1; i++) {
    var content = row.cells[i].querySelector(".editable").innerText;
    row.cells[i].innerHTML = '<span class="editable">' + content + "</span>";
  }

  // Recalculate total score and update the total score cell
  var totalScore =
    parseInt(row.cells[1].innerText) +
    parseInt(row.cells[2].innerText) +
    parseInt(row.cells[3].innerText);
  row.cells[4].innerHTML =
    '<span class="editable" style="color: ' +
    getColorForTotalScore(totalScore) +
    ';">' +
    totalScore +
    "</span>";

  // Change button text and behavior back to edit
  button.innerText = "Edit";
  button.onclick = function () {
    editGrade(button);
  };

  // Save the updated data to local storage
  saveTableData();
}

// Function to determine color based on total score
function getColorForTotalScore(score) {
  return score >= 75 ? "black" : "red";
}