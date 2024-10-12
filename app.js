// Your updated Google Sheets API key and Spreadsheet ID
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your new API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:Q'; // The range from A12 to Q12

// Function to initialize the Google API client
function initClient() {
    console.log("Initializing Google API client..."); // Debugging log
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            console.log("Google API client initialized successfully."); // Debugging log
            getData(); // Call the function to get data once the client is initialized
        }).catch((error) => {
            console.error('Error initializing GAPI client for API:', error); // Log error
        });
    });
}

// Function to fetch data from the Google Sheet and filter it by the last 30 days
function getData() {
    console.log("Fetching data from Google Sheets..."); // Debugging log
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then((response) => {
        console.log("API Response:", response); // Log the entire API response
        const data = response.result.values;
        if (data && data.length > 0) {
            console.log("Data retrieved:", data); // Log the data received
            const filteredData = filterLast30Days(data); // If you're using date filtering
            displayData(filteredData);
        } else {
            console.log('No data found.');
            $('#dashboard').html('<p>No data found in the specified range.</p>');
        }
    }).catch((error) => {
        console.error('Error fetching data:', error); // Log the error in the console
    });
}

// Function to filter data for the last 30 days (if needed)
function filterLast30Days(data) {
    const today = new Date();
    const last30Days = new Date(today.setDate(today.getDate() - 30));

    return data.filter(row => {
        const dateStr = row[0]; // Assuming column A contains the date in each row
        const rowDate = new Date(dateStr);
        return rowDate >= last30Days; // Only include rows from the last 30 days
    });
}

// Function to display the filtered data (with conditional formatting)
function displayData(data) {
    console.log("Displaying data..."); // Debugging log
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    
    data.forEach(row => {
