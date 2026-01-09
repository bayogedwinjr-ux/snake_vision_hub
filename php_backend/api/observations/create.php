<?php
/**
 * CREATE new observation
 * Endpoint: POST /api/observations/create.php
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    empty($data->species) ||
    !isset($data->length) ||
    empty($data->location) ||
    empty($data->dateObserved)
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields: species, length, location, dateObserved'
    ]);
    exit;
}

try {
    // Try to find matching snake by common name
    $snakeId = null;
    $findSnakeQuery = "SELECT id FROM snakes WHERE common_name = :species LIMIT 1";
    $findStmt = $db->prepare($findSnakeQuery);
    $findStmt->bindParam(':species', $data->species);
    $findStmt->execute();
    $snake = $findStmt->fetch();
    if ($snake) {
        $snakeId = $snake['id'];
    }
    
    $query = "INSERT INTO observations 
        (snake_id, species, length_cm, weight_g, location, date_observed, picture_url, notes)
        VALUES 
        (:snake_id, :species, :length_cm, :weight_g, :location, :date_observed, :picture_url, :notes)";
    
    $stmt = $db->prepare($query);
    
    $weight = isset($data->weight) ? $data->weight : null;
    $pictureUrl = isset($data->pictureUrl) ? $data->pictureUrl : null;
    $notes = isset($data->notes) ? $data->notes : null;
    
    $stmt->bindParam(':snake_id', $snakeId);
    $stmt->bindParam(':species', $data->species);
    $stmt->bindParam(':length_cm', $data->length);
    $stmt->bindParam(':weight_g', $weight);
    $stmt->bindParam(':location', $data->location);
    $stmt->bindParam(':date_observed', $data->dateObserved);
    $stmt->bindParam(':picture_url', $pictureUrl);
    $stmt->bindParam(':notes', $notes);
    
    if ($stmt->execute()) {
        $newId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Observation created successfully',
            'data' => [
                'id' => (string)$newId,
                'snakeId' => $snakeId ? (int)$snakeId : null,
                'species' => $data->species,
                'length' => (float)$data->length,
                'weight' => $weight ? (float)$weight : null,
                'location' => $data->location,
                'dateObserved' => $data->dateObserved,
                'pictureUrl' => $pictureUrl,
                'notes' => $notes,
                'createdAt' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception('Failed to create observation');
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
