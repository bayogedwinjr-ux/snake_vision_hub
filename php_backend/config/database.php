<?php
/**
 * Database Configuration for Snake Vision Hub
 * Configure these settings for your WAMP Server
 */

class Database {
    private $host = "localhost";
    private $db_name = "snake_vision_hub";
    private $username = "root";
    private $password = "";  // Default WAMP password is empty
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
            exit;
        }

        return $this->conn;
    }
}
