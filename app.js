function displayData(data) {
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    
    data.forEach(row => {
        const columnQ = row[16] || ''; // Column Q value (text)

        // Determine the color based on the corrected text in column Q
        let color = '';
        if (columnQ.includes('تنعيم، خروج عالي عن المستهدف') || columnQ.includes('تخشين، خروج عالي عن المستهدف')) {
            color = 'red'; // Apply red color
        } else if (columnQ.includes('تخشين، خروج بسيط عن المستهدف')) {
            color = 'yellow'; // Apply yellow color
        } else if (columnQ.includes('ضمن المدى المستهدف للمحصول')) {
            color = 'green'; // Apply green color
        }

        html += `<tr>
                    <td>${row[0] || ''}</td> <!-- Column A: Date -->
                    <td>${row[1] || ''}</td> <!-- Column B -->
                    <td>${row[3] || ''}</td> <!-- Column D -->
                    <td>${row[6] || ''}</td> <!-- Column G -->
                    <td>${row[11] || ''}</td> <!-- Column L -->
                    <td>${row[13] || ''}</td> <!-- Column N -->
                    <td style="background-color:${color}">${columnQ}</td> <!-- Column Q with conditional formatting -->
                </tr>`;
    });

    html += '</table>';
    $('#dashboard').html(html); // Update the dashboard with the generated HTML
}
