# Snake Vision Hub - PHP Backend

This PHP backend is designed to run on WAMP Server for the Snake Vision Hub application.

## Setup Instructions

### 1. Install WAMP Server
Download and install WAMP from: https://www.wampserver.com/

### 2. Copy Files
Copy the entire `php_backend` folder to:
```
C:\wamp64\www\snake_vision_hub\
```

### 3. Create Database
1. Start WAMP Server
2. Click on WAMP icon in system tray → phpMyAdmin
3. Click "Import" tab
4. Choose file: `snake_vision_hub.sql`
5. Click "Go" to import

Alternatively, you can:
1. Create a new database named `snake_vision_hub`
2. Run the SQL file contents in the SQL tab

### 4. Configure Database Connection
Edit `config/database.php` if needed:
```php
private $host = "localhost";
private $db_name = "snake_vision_hub";
private $username = "root";
private $password = "";  // Default WAMP password is empty
```

### 5. Test the API
Visit these URLs in your browser:
- http://localhost/snake_vision_hub/api/snakes/read.php
- http://localhost/snake_vision_hub/api/observations/read.php

## API Endpoints

### Snakes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/snakes/read.php` | Get all snakes |
| GET | `/api/snakes/read_single.php?id={id}` | Get single snake |
| POST | `/api/snakes/create.php` | Create new snake |
| PUT | `/api/snakes/update.php` | Update snake |
| DELETE | `/api/snakes/delete.php?id={id}` | Delete snake |

### Observations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/observations/read.php` | Get all observations |
| POST | `/api/observations/create.php` | Create observation |
| DELETE | `/api/observations/delete.php?id={id}` | Delete observation |

## Request/Response Format

All endpoints accept and return JSON.

### Create Observation Example
```json
POST /api/observations/create.php
{
  "species": "King Cobra",
  "length": 250,
  "weight": 5000,
  "location": "Cebu City",
  "dateObserved": "2024-01-15",
  "notes": "Found near river"
}
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "count": 28
}
```

## Troubleshooting

### CORS Issues
The `config/cors.php` file allows all origins. For production, restrict to specific domains.

### Database Connection Failed
1. Ensure WAMP is running (green icon)
2. Check database credentials in `config/database.php`
3. Verify database `snake_vision_hub` exists
