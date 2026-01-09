<?php
/**
 * GET all snakes
 * Endpoint: GET /api/snakes/read.php
 */

// Include CORS handler
include_once '../cors.php';

// Include database
include_once '../../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Query to get all snakes
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
              ORDER BY common_name ASC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $snakes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Set response code - 200 OK
    http_response_code(200);
    
    // Return snakes as JSON
    echo json_encode([
        "success" => true,
        "count" => count($snakes),
        "data" => $snakes
    ]);
    
} catch(Exception $e) {
    // Set response code - 500 Internal Server Error
    http_response_code(500);
    
    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve snakes",
        "error" => $e->getMessage()
    ]);
}
?>
