//adjust this if your path is different
const API_BASE = "/cob290-part3-team08/server/api/analytics/"



//this gets the All the tasks
fetch(API_BASE + "getTasks.php")
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);
    // You can now use the JSON data here
  })
  .catch(error => {
    console.error("Fetch error:", error);
});


//this gets the user/project information (description, email etc)
let url = API_BASE
if(currentPageType == "project"){
  url += "getProjects.php"
} else{
  url += "getEmployee.php"
}

fetch(url)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);
    // You can now use the JSON data here
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

