<?php
/**
 * GET all observations
 * Endpoint: GET /api/observations/read.php
 */

// Include CORS handler
include_once '../cors.php';

// Include database
include_once '../../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Query to get all observations with snake info
    $query = "SELECT 
                o.id, 
                o.snake_id,
                o.species, 
                o.length_cm, 
                o.weight_g, 
                o.location,
                o.date_observed, 
                o.picture_url, 
                o.notes,
                o.created_at,
                s.venomous as snake_venomous,
                s.species_name as scientific_name
              FROM observations o
              LEFT JOIN snakes s ON o.snake_id = s.id
              ORDER BY o.date_observed DESC, o.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $observations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Set response code - 200 OK
    http_response_code(200);
    
    // Return observations as JSON
    echo json_encode([
        "success" => true,
        "count" => count($observations),
        "data" => $observations
    ]);
    
} catch(Exception $e) {
    // Set response code - 500 Internal Server Error
    http_response_code(500);
    
    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve observations",
        "error" => $e->getMessage()
    ]);
}
?>
