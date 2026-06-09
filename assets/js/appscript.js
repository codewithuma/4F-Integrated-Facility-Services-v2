function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Retrieve submission parameters
    var data = e.parameter;
    
    var timestamp = new Date();
    var ticketId = data.ticketId || "";
    var services = data.services || "";
    var facilityType = data.facilityType || "";
    var facilitySize = data.facilitySize || "";
    var name = data.name || "";
    var company = data.company || "";
    var email = data.email || "";
    var phone = data.phone || "";
    var message = data.message || "";
    
    // Fire NOC specific parameters (Optional columns K & L)
    var fireArchitecture = data.fireArchitecture || "";
    var proposalAvailable = data.proposalAvailable || "";
    
    // Append row matching Column A through Column L
    sheet.appendRow([
      timestamp, 
      ticketId, 
      services, 
      facilityType, 
      facilitySize, 
      name, 
      company, 
      email, 
      phone, 
      message,
      fireArchitecture,  // Column K
      proposalAvailable  // Column L
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "ticketId": ticketId }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Web App is running successfully!");
}
