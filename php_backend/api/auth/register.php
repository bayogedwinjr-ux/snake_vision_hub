<?php
/**
 * POST - Register new user
 * Endpoint: POST /api/auth/register.php
 */

// Include CORS handler
include_once '../cors.php';

// Include database
include_once '../../config/database.php';

try {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (
        empty($data->username) ||
        empty($data->email) ||
        empty($data->password)
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: username, email, password"
        ]);
        exit;
    }
    
    // Validate email format
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid email format"
        ]);
        exit;
    }
    
    // Validate password length
    if (strlen($data->password) < 6) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 6 characters"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $data->email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email already registered"
        ]);
        exit;
    }
    
    // Check if username already exists
    $checkQuery = "SELECT id FROM users WHERE username = :username";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':username', $data->username);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Username already taken"
        ]);
        exit;
    }
    
    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
    
    // Insert user (always 'user' role for registration)
    $query = "INSERT INTO users (username, email, password_hash, role) VALUES (:username, :email, :password_hash, 'user')";
    $stmt = $db->prepare($query);
    
    $username = htmlspecialchars(strip_tags($data->username));
    $email = htmlspecialchars(strip_tags($data->email));
    
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password_hash', $password_hash);
    
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        
        // Generate session token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        
        $sessionQuery = "INSERT INTO sessions (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)";
        $sessionStmt = $db->prepare($sessionQuery);
        $sessionStmt->bindParam(':user_id', $userId);
        $sessionStmt->bindParam(':token', $token);
        $sessionStmt->bindParam(':expires_at', $expiresAt);
        $sessionStmt->execute();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "User registered successfully",
            "token" => $token,
            "user" => [
                "id" => $userId,
                "username" => $username,
                "email" => $email,
                "role" => "user"
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to register user"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Registration failed",
        "error" => $e->getMessage()
    ]);
}
?>
