<?php
/**
 * GET - Verify token
 * Endpoint: GET /api/auth/verify.php
 */

// Include CORS handler
include_once '../cors.php';

// Include database
include_once '../../config/database.php';

try {
    // Get Authorization header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(200);
        echo json_encode([
            "valid" => false,
            "message" => "No token provided"
        ]);
        exit;
    }
    
    $token = $matches[1];
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Check token and get user
    $query = "SELECT u.id, u.username, u.email, u.role, s.expires_at 
              FROM sessions s 
              JOIN users u ON s.user_id = u.id 
              WHERE s.token = :token";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(200);
        echo json_encode([
            "valid" => false,
            "message" => "Invalid token"
        ]);
        exit;
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if token is expired
    if (strtotime($result['expires_at']) < time()) {
        // Delete expired session
        $deleteQuery = "DELETE FROM sessions WHERE token = :token";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':token', $token);
        $deleteStmt->execute();
        
        http_response_code(200);
        echo json_encode([
            "valid" => false,
            "message" => "Token expired"
        ]);
        exit;
    }
    
    http_response_code(200);
    echo json_encode([
        "valid" => true,
        "user" => [
            "id" => $result['id'],
            "username" => $result['username'],
            "email" => $result['email'],
            "role" => $result['role']
        ]
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "valid" => false,
        "message" => "Verification failed",
        "error" => $e->getMessage()
    ]);
}
?>
