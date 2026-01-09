<?php
/**
 * GET all snakes from database
 * Endpoint: GET /api/snakes/read.php
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

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
    ORDER BY common_name ASC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $snakes = $stmt->fetchAll();
    
    // Transform to camelCase for frontend
    $result = array_map(function($snake) {
        return [
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
    }, $snakes);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result,
        'count' => count($result)
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
