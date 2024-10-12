// Your Google Sheets API key and Spreadsheet ID
const API_KEY = '4e20cbac2aa8c73563743cfae97348bc5d8f8f15'; // Your API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A1:E'; // The range in your Google Sheet

// Function to initialize the Google API client
function initClient() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            getData(); // Call the function to get data once the client is initialized
        }).catch((error) => {
            console.error('Error loading GAPI client for API', error);
        });
    });
}

// Function to fetch data from the Google Sheet
function getData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then((response) => {
        const data = response.result.values; // Get the values from the response
        if (data && data.length > 0) { // Check if data is returned
            displayData(data); // Call function to display the data
        } else {
            console.log('No data found.'); // Log if no data is found
            $('#dashboard').html('<p>No data found in the specified range.</p>'); // Inform user
        }
    }).catch((error) => {
        console.error('Error fetching data', error); // Log any errors
    });
}

// Function to display data in the dashboard
function displayData(data) {
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Location</th><th>Performance</th></tr>';
    data.forEach(row => {
        html += `<tr><td>${row[0] || ''}</td><td>${row[1] || ''}</td><td>${row[2] || ''}</td><td>${row[3] || ''}</td></tr>`;
    });
    html += '</table>';
    $('#dashboard').html(html); // Update the dashboard with the generated HTML
}

// Initialize the client when the document is ready
$(document).ready(function() {
    gapi.load('client', initClient); // Load the API client and initialize it
});
