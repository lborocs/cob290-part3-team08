//adjust this if your path is different
const API_BASE = "/cob290-part3-team08/server/api/analytics/"

document.addEventListener("DOMContentLoaded", () => {
  //this gets the All the tasks
  fetch(API_BASE + "getTasks.php")
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);

    // You can now use the JSON data here
    let column;
    if(currentPageType == "project"){
      column = "employee_name";
    }else{
      column = "project_name";
    }
    console.log(countTasksByColumn(column, data));
    
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });


  //this gets the user/project information (description, email etc)
  let url = API_BASE
  if(currentPageType == "project"){
  url += "getProjects.php";
  } else{
  url += "getEmployee.php";
  }

  fetch(url)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);
    //data = user/project Details
    // You can now use the JSON data here
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
});




//returns dictionary of users/project -> taskNum
function countTasksByColumn(columName, tasks){
  let column;
  let taskCountDic = [];
  if(currentPageType == "project"){
    column = "employee_name";
  }else{
    column = "project_name";
  }

  tasks.forEach(task => {
    if (taskCountDic.hasOwnProperty(task[columName])) {
      taskCountDic[task[columName]]++;
    } else {
      taskCountDic[task[columName]] = 1;
    }
  });
  return taskCountDic;
}

