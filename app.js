// Replace with your actual API key and spreadsheet ID
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Replace with your API key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Replace with your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:S'; // Adjust the range to include column S

// Function to initialize the Google API client
function initClient() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        }).then(() => {
            console.log('Google API client loaded successfully.');
            getData(); // Fetch data from Google Sheets
        }).catch((error) => {
            console.error("Error loading Google API client", error);
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
        if (data && data.length > 0) {
            displayData(data); // Display the fetched data
        } else {
            console.log('No data found.');
            document.getElementById('dashboard').innerHTML = '<p>No data found in the specified range.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching data from Google Sheets', error);
    });
}

// Function to display the fetched data in a table format
function displayData(data) {
    let html = `
        <table border="1">
            <tr>
                <th>التاريخ</th>
                <th>اسم الموظف</th>
                <th>المحصول</th>
                <th>نسبة التركيز TDS%</th>
                <th>الفرع</th>
                <th>الطحنة</th>
                <th>التركيز المناسب TDS%</th>
                <th>الاجراء</th>
                <th>Column S (CHECKBOX)</th>
            </tr>`;
    
    data.forEach((row, index) => {
        const checkboxValue = row[18] === 'TRUE' ? 'checked' : ''; // Adjust based on value in column S
        html += `
            <tr>
                <td>${row[0] || ''}</td> <!-- Date -->
                <td>${row[1] || ''}</td> <!-- Employee Name -->
                <td>${row[2] || ''}</td> <!-- المحصول -->
                <td>${row[3] || ''}</td> <!-- نسبة التركيز TDS% -->
                <td>${row[10] || ''}</td> <!-- الفرع -->
                <td>${row[11] || ''}</td> <!-- الطحنة -->
                <td>${row[13] || ''}</td> <!-- التركيز المناسب TDS% -->
                <td>${row[16] || ''}</td> <!-- الاجراء -->
                <td><input type="checkbox" id="checkbox-${index}" ${checkboxValue} onclick="updateCheckbox(${index}, this.checked)"></td> <!-- Checkbox -->
            </tr>`;
    });

    html += '</table>';
    document.getElementById('dashboard').innerHTML = html;
}

// Function to update the checkbox value in the Google Sheet
function updateCheckbox(rowIndex, checked) {
    const checkboxValue = checked ? 'TRUE' : 'FALSE';
    const range = `S${rowIndex + 13}:S${rowIndex + 13}`; // Assuming data starts from row 12

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[checkboxValue]],
        },
    }).then(response => {
        console.log('Checkbox updated successfully:', response);
    }).catch(error => {
        console.error('Error updating checkbox:', error);
    });
}

// Initialize the client when the document is ready
document.addEventListener("DOMContentLoaded", function() {
    gapi.load('client', initClient); // Load the Google API client
});
