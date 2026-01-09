<?php
/**
 * CREATE new snake species
 * Endpoint: POST /api/snakes/create.php
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    empty($data->commonName) ||
    empty($data->speciesName) ||
    empty($data->venomous) ||
    empty($data->status)
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields: commonName, speciesName, venomous, status'
    ]);
    exit;
}

try {
    $query = "INSERT INTO snakes 
        (common_name, species_name, venomous, status, distribution, habitat, description, ecological_role, image_url)
        VALUES 
        (:common_name, :species_name, :venomous, :status, :distribution, :habitat, :description, :ecological_role, :image_url)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':common_name', $data->commonName);
    $stmt->bindParam(':species_name', $data->speciesName);
    $stmt->bindParam(':venomous', $data->venomous);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':distribution', $data->distribution ?? '');
    $stmt->bindParam(':habitat', $data->habitat ?? '');
    $stmt->bindParam(':description', $data->description ?? '');
    $stmt->bindParam(':ecological_role', $data->ecologicalRole ?? '');
    $stmt->bindParam(':image_url', $data->imageUrl ?? null);
    
    if ($stmt->execute()) {
        $newId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Snake created successfully',
            'id' => (int)$newId
        ]);
    } else {
        throw new Exception('Failed to create snake');
    }
    
} catch(PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error' => 'A snake with this species name already exists'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
