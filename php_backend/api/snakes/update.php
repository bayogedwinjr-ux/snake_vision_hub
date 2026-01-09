<?php
/**
 * UPDATE snake species
 * Endpoint: PUT /api/snakes/update.php
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate ID
if (empty($data->id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Snake ID is required'
    ]);
    exit;
}

try {
    // Build dynamic update query
    $updateFields = [];
    $params = [':id' => $data->id];
    
    if (!empty($data->commonName)) {
        $updateFields[] = "common_name = :common_name";
        $params[':common_name'] = $data->commonName;
    }
    if (!empty($data->speciesName)) {
        $updateFields[] = "species_name = :species_name";
        $params[':species_name'] = $data->speciesName;
    }
    if (!empty($data->venomous)) {
        $updateFields[] = "venomous = :venomous";
        $params[':venomous'] = $data->venomous;
    }
    if (!empty($data->status)) {
        $updateFields[] = "status = :status";
        $params[':status'] = $data->status;
    }
    if (isset($data->distribution)) {
        $updateFields[] = "distribution = :distribution";
        $params[':distribution'] = $data->distribution;
    }
    if (isset($data->habitat)) {
        $updateFields[] = "habitat = :habitat";
        $params[':habitat'] = $data->habitat;
    }
    if (isset($data->description)) {
        $updateFields[] = "description = :description";
        $params[':description'] = $data->description;
    }
    if (isset($data->ecologicalRole)) {
        $updateFields[] = "ecological_role = :ecological_role";
        $params[':ecological_role'] = $data->ecologicalRole;
    }
    if (isset($data->imageUrl)) {
        $updateFields[] = "image_url = :image_url";
        $params[':image_url'] = $data->imageUrl;
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No fields to update'
        ]);
        exit;
    }
    
    $query = "UPDATE snakes SET " . implode(', ', $updateFields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Snake updated successfully'
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Snake not found or no changes made'
            ]);
        }
    } else {
        throw new Exception('Failed to update snake');
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
