const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE';
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w';
const RANGE = 'Drip & COTD!A12:S';
const CLIENT_ID = '1065961533552-4ukc1utf902uldqfq3nvcmrohjehbd2e.apps.googleusercontent.com';

let gapiInited = false;

function handleClientLoad() {
    gapi.load('client', initGapiClient);
}

function initGapiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        console.log('GAPI client loaded for API');
        gapiInited = true;
        getData();
    }, function(error) {
        console.error('Error loading GAPI client:', error);
    });
}

function getData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then(response => {
        const data = response.result.values;
        if (data && data.length > 0) {
            const filteredData = filterDataByDate(data, startDate, endDate);
            displayData(filteredData);
        } else {
            console.log('No data found.');
            document.getElementById('dashboard').innerHTML = '<p>No data found in the specified range.</p>';
        }
    }).catch(error => {
        console.error('Error fetching data from Google Sheets', error);
    });
}

function filterDataByDate(data, startDate, endDate) {
    return data.filter(row => {
        const rowDate = new Date(row[0]);  // Assuming first column is date
        const start = new Date(startDate);
        const end = new Date(endDate);
        return rowDate >= start && rowDate <= end;
    });
}

function displayData(data) {
    let html = `
        <table>
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
        const checkboxValue = row[18] === 'TRUE' ? 'checked' : '';  // Assuming column S is the checkbox
        html += `
            <tr>
                <td>${row[0] || ''}</td>
                <td>${row[1] || ''}</td>
                <td>${row[2] || ''}</td>
                <td>${row[3] || ''}</td>
                <td>${row[10] || ''}</td>
                <td>${row[11] || ''}</td>
                <td>${row[13] || ''}</td>
                <td>${row[16] || ''}</td>
                <td><input type="checkbox" id="checkbox-${index}" ${checkboxValue} onclick="updateCheckbox(${index}, this.checked)"></td>
            </tr>`;
    });

    html += '</table>';
    document.getElementById('dashboard').innerHTML = html;
}

function updateCheckbox(rowIndex, checked) {
    const checkboxValue = checked ? 'TRUE' : 'FALSE';
    const range = `S${rowIndex + 13}:S${rowIndex + 13}`;

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

document.getElementById('applyFilter').addEventListener('click', getData);
