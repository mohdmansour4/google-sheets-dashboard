// Your OAuth Client ID and API Key
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // Replace with your OAuth Client ID
const API_KEY = 'YOUR_API_KEY'; // Replace with your Google API key
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID

// Initialize Google Identity Services Client
function initClient() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        }).then(() => {
            console.log('Google API client loaded successfully.');
            getData(); // Fetch data from Google Sheets
        }, (error) => {
            console.error("Error loading Google API client", error);
        });
    });
}

// Load the GAPI client and Sheets API
function loadGapiClient() {
    gapi.load("client", () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4").then(() => {
            console.log("Google Sheets API loaded");
            getData(); // Fetch data from Google Sheets
        }, (error) => {
            console.error("Error loading GAPI client for API", error);
        });
    });
}

// Fetch data from Google Sheets
function getData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Drip & COTD!A12:S',
    }).then(function (response) {
        const data = response.result.values;
        displayData(data);
    }, function (error) {
        console.error("Error fetching data", error);
    });
}

// Display data in the table
function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear existing data

    data.forEach(row => {
        const tr = document.createElement('tr');

        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || ''; // Fill in data or leave empty
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}

// Event listener for date filtering
document.getElementById('applyFilter').addEventListener('click', function () {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        filterDataByDate(startDate, endDate);
    } else {
        alert("Please select both start and end dates.");
    }
});

// Filter data by selected date range
function filterDataByDate(startDate, endDate) {
    const filteredData = data.filter(row => {
        const rowDate = new Date(row[0]); // Assuming date is in the first column (A)
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
    });

    displayData(filteredData);
}

// Initialize the Google Identity Services Client when the document is ready
document.addEventListener('DOMContentLoaded', function () {
    initClient(); // Initialize the Google Identity Services
});
