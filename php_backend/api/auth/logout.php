<?php
/**
 * POST - User logout
 * Endpoint: POST /api/auth/logout.php
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
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No authorization token provided"
        ]);
        exit;
    }
    
    $token = $matches[1];
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Delete session
    $query = "DELETE FROM sessions WHERE token = :token";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Logged out successfully"
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Logout failed",
        "error" => $e->getMessage()
    ]);
}
?>
