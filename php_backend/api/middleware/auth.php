<?php
/**
 * Authentication Middleware
 * Include this file and call requireAuth() to protect endpoints
 */

include_once dirname(__FILE__) . '/../../config/database.php';

/**
 * Verify authentication and optionally check role
 * @param string $requiredRole - 'user' or 'admin'
 * @return array|null - User data if authenticated, null otherwise (will send error response)
 */
function requireAuth($requiredRole = 'user') {
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
    
    try {
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
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid token"
            ]);
            exit;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Check if token is expired
        if (strtotime($user['expires_at']) < time()) {
            // Delete expired session
            $deleteQuery = "DELETE FROM sessions WHERE token = :token";
            $deleteStmt = $db->prepare($deleteQuery);
            $deleteStmt->bindParam(':token', $token);
            $deleteStmt->execute();
            
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Token expired"
            ]);
            exit;
        }
        
        // Check role if admin is required
        if ($requiredRole === 'admin' && $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "message" => "Admin access required"
            ]);
            exit;
        }
        
        return [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "role" => $user['role']
        ];
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Authentication failed",
            "error" => $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 * Does not block the request if not authenticated
 */
function optionalAuth() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return null;
    }
    
    $token = $matches[1];
    
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        $query = "SELECT u.id, u.username, u.email, u.role, s.expires_at 
                  FROM sessions s 
                  JOIN users u ON s.user_id = u.id 
                  WHERE s.token = :token AND s.expires_at > NOW()";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            return null;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "role" => $user['role']
        ];
        
    } catch(Exception $e) {
        return null;
    }
}
?>
