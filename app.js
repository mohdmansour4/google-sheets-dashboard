<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sheets Performance Dashboard</title>

    <!-- jQuery CDN -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Google API Client Library -->
    <script src="https://apis.google.com/js/api.js"></script>

    <!-- Cache-Control Meta Tags -->
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">

    <!-- Custom CSS for Styling -->
    <style>
        body {
            font-family: 'Arial', sans-serif;
            text-align: center;
            background-color: #f9f9f9;
        }

        h1 {
            font-size: 2.5em;
            color: #333;
            margin-top: 20px;
        }

        #filter {
            margin-bottom: 20px;
        }

        label {
            font-weight: bold;
            margin-right: 10px;
        }

        input[type="date"] {
            padding: 5px;
            font-size: 1em;
            margin-right: 10px;
        }

        button {
            padding: 10px 20px;
            font-size: 1em;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

        table {
            width: 90%;
            margin: 20px auto;
            border-collapse: collapse;
            border: 1px solid #ddd;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            border-radius: 8px;
        }

        th, td {
            padding: 12px 15px;
            text-align: center;
        }

        th {
            background-color: #4CAF50;
            color: white;
            font-size: 1.2em;
            text-transform: uppercase;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }

        td {
            border-bottom: 1px solid #ddd;
            font-size: 1em;
        }

        td[style*="background-color:red"] {
            color: white;
            font-weight: bold;
        }

        td[style*="background-color:yellow"] {
            font-weight: bold;
        }

        td[style*="background-color:green"] {
            color: white;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>لوحة أداء الموظفين</h1>

    <!-- Date Filter Section -->
    <div id="filter">
        <label for="startDate">تاريخ البداية:</label>
        <input type="date" id="startDate">
        
        <label for="endDate">تاريخ النهاية:</label>
        <input type="date" id="endDate">
        
        <button id="applyFilter">تطبيق الفلتر</button>
    </div>

    <!-- Dashboard Section where the table will be displayed -->
    <div id="dashboard"></div>

    <!-- Load app.js script with cache-busting -->
    <script src="app.js?v=1"></script>
</body>
</html>
