<?php
/**
 * GET single snake by ID
 * Endpoint: GET /api/snakes/read_single.php?id={id}
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get ID from query parameter
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid snake ID'
    ]);
    exit;
}

try {
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
        created_at
    FROM snakes 
    WHERE id = :id
    LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $snake = $stmt->fetch();
    
    if (!$snake) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Snake not found'
        ]);
        exit;
    }
    
    // Transform to camelCase for frontend
    $result = [
        'id' => (int)$snake['id'],
        'commonName' => $snake['common_name'],
        'speciesName' => $snake['species_name'],
        'venomous' => $snake['venomous'],
        'status' => $snake['status'],
        'distribution' => $snake['distribution'],
        'habitat' => $snake['habitat'],
        'description' => $snake['description'],
        'ecologicalRole' => $snake['ecological_role'],
        'imageUrl' => $snake['image_url'],
        'createdAt' => $snake['created_at']
    ];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
