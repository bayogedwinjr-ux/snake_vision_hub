<?php
/**
 * GET all observations from database
 * Endpoint: GET /api/observations/read.php
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
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
        s.common_name as snake_common_name
    FROM observations o
    LEFT JOIN snakes s ON o.snake_id = s.id
    ORDER BY o.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $observations = $stmt->fetchAll();
    
    // Transform to camelCase for frontend
    $result = array_map(function($obs) {
        return [
            'id' => (string)$obs['id'],
            'snakeId' => $obs['snake_id'] ? (int)$obs['snake_id'] : null,
            'species' => $obs['species'],
            'length' => (float)$obs['length_cm'],
            'weight' => $obs['weight_g'] ? (float)$obs['weight_g'] : null,
            'location' => $obs['location'],
            'dateObserved' => $obs['date_observed'],
            'pictureUrl' => $obs['picture_url'],
            'notes' => $obs['notes'],
            'createdAt' => $obs['created_at'],
            'snakeCommonName' => $obs['snake_common_name']
        ];
    }, $observations);
    
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
