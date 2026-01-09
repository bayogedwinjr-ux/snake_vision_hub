# Snake Vision Hub - PHP Backend

## Setup Instructions (WAMP Server)

### 1. Install WAMP Server
Download and install WAMP from: https://www.wampserver.com/

### 2. Copy Files
Copy the entire `php_backend` folder to:
```
C:\wamp64\www\snake_vision_hub\
```

### 3. Create Database
1. Start WAMP server (ensure the icon is green)
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Click "Import" tab
4. Select `snake_vision_hub.sql` file
5. Click "Go" to execute

The SQL file will:
- Create the `snake_vision_hub` database
- Create `snakes` and `observations` tables
- Insert all 28 Philippine snake species from the CSV metadata

### 4. Verify Installation
Test the API endpoints:
- Get all snakes: http://localhost/snake_vision_hub/api/snakes/read.php
- Get single snake: http://localhost/snake_vision_hub/api/snakes/read_single.php?id=1

## API Endpoints

### Snakes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/snakes/read.php` | Get all snakes |
| GET | `/api/snakes/read_single.php?id={id}` | Get snake by ID |
| POST | `/api/snakes/create.php` | Create new snake |
| PUT | `/api/snakes/update.php` | Update snake |

### Observations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/observations/read.php` | Get all observations |
| POST | `/api/observations/create.php` | Create new observation |
| DELETE | `/api/observations/delete.php?id={id}` | Delete observation |

## Configuration

Edit `config/database.php` if you need to change:
- Database host (default: localhost)
- Database name (default: snake_vision_hub)
- Username (default: root)
- Password (default: empty)

## CORS

CORS headers are configured in `.htaccess` to allow requests from:
- Lovable preview URLs
- localhost development

## Troubleshooting

### "Access denied" error
- Check MySQL credentials in `config/database.php`
- Ensure WAMP MySQL service is running

### "Database not found" error
- Import `snake_vision_hub.sql` through phpMyAdmin

### CORS errors
- Ensure Apache mod_headers is enabled in WAMP
- Check `.htaccess` is being read (AllowOverride All)
