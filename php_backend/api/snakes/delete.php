<?php
/**
 * DELETE snake species
 * Endpoint: DELETE /api/snakes/delete.php?id={id}
 */

require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get ID from query parameter or body
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    // Try to get from body
    $data = json_decode(file_get_contents("php://input"));
    $id = isset($data->id) ? intval($data->id) : 0;
}

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid snake ID'
    ]);
    exit;
}

try {
    $query = "DELETE FROM snakes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Snake deleted successfully'
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Snake not found'
            ]);
        }
    } else {
        throw new Exception('Failed to delete snake');
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
