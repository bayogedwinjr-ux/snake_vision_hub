<?php
/**
 * Database Configuration for Snake Vision Hub
 * Configure these settings for your WAMP server
 */

class Database {
    // Database credentials - modify these for your WAMP setup
    private $host = "localhost";
    private $db_name = "snake_vision_hub";
    private $username = "root";
    private $password = ""; // Default WAMP password is empty
    private $port = "3306";
    
    public $conn;
    
    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
        
        return $this->conn;
    }
}
?>
