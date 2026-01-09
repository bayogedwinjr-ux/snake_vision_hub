<?php
/**
 * GET single snake by ID
 * Endpoint: GET /api/snakes/read_single.php?id=1
 */

// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// Include database
include_once '../../config/database.php';

try {
    // Get ID from URL
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid snake ID"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Query to get single snake
    $query = "SELECT 
                id, 
                common_name, 
                species_name, 
                venomous, 
                status, 
                distribution, 
                habitat, 
                description, 
                ecological_role, 
                image_url,
                created_at,
                updated_at
              FROM snakes 
              WHERE id = :id 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $snake = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($snake) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $snake
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Snake not found"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve snake",
        "error" => $e->getMessage()
    ]);
}
?>
