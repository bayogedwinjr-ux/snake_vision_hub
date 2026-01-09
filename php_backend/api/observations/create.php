<?php
/**
 * POST - Create new observation
 * Endpoint: POST /api/observations/create.php
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
        empty($data->species) ||
        empty($data->location) ||
        empty($data->date_observed)
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: species, location, date_observed"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Try to find matching snake_id
    $snake_id = null;
    $findSnakeQuery = "SELECT id FROM snakes WHERE common_name = :species LIMIT 1";
    $findStmt = $db->prepare($findSnakeQuery);
    $findStmt->bindParam(':species', $data->species);
    $findStmt->execute();
    $snakeResult = $findStmt->fetch(PDO::FETCH_ASSOC);
    if ($snakeResult) {
        $snake_id = $snakeResult['id'];
    }
    
    // Insert query
    $query = "INSERT INTO observations 
              (snake_id, species, length_cm, weight_g, location, date_observed, picture_url, notes) 
              VALUES 
              (:snake_id, :species, :length_cm, :weight_g, :location, :date_observed, :picture_url, :notes)";
    
    $stmt = $db->prepare($query);
    
    // Sanitize and bind values
    $species = htmlspecialchars(strip_tags($data->species));
    $length_cm = isset($data->length_cm) ? floatval($data->length_cm) : null;
    $weight_g = isset($data->weight_g) ? floatval($data->weight_g) : null;
    $location = htmlspecialchars(strip_tags($data->location));
    $date_observed = $data->date_observed;
    $picture_url = isset($data->picture_url) ? $data->picture_url : null; // Base64 can be large
    $notes = isset($data->notes) ? htmlspecialchars(strip_tags($data->notes)) : null;
    
    $stmt->bindParam(':snake_id', $snake_id, PDO::PARAM_INT);
    $stmt->bindParam(':species', $species);
    $stmt->bindParam(':length_cm', $length_cm);
    $stmt->bindParam(':weight_g', $weight_g);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':date_observed', $date_observed);
    $stmt->bindParam(':picture_url', $picture_url);
    $stmt->bindParam(':notes', $notes);
    
    if ($stmt->execute()) {
        $lastId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Observation created successfully",
            "id" => $lastId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to create observation"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to create observation",
        "error" => $e->getMessage()
    ]);
}
?>
