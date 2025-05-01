//adjust this if your path is different
const API_BASE = "/cob290-part3-team08/server/api/analytics/getTasks.php"


fetch(API_BASE)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log("Received data:", data);
    // You can now use the JSON data here
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

