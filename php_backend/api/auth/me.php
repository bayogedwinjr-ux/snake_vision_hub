<?php
/**
 * GET - Get current user info
 * Endpoint: GET /api/auth/me.php
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
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Authorization required"
        ]);
        exit;
    }
    
    $token = $matches[1];
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Check token and get user
    $query = "SELECT u.id, u.username, u.email, u.role, u.created_at, s.expires_at 
              FROM sessions s 
              JOIN users u ON s.user_id = u.id 
              WHERE s.token = :token AND s.expires_at > NOW()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid or expired token"
        ]);
        exit;
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "role" => $user['role'],
            "created_at" => $user['created_at']
        ]
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to get user info",
        "error" => $e->getMessage()
    ]);
}
?>
