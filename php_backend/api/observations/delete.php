<?php
/**
 * DELETE - Remove observation
 * Endpoint: DELETE /api/observations/delete.php?id=1
 */

// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database
include_once '../../config/database.php';

try {
    // Get ID from URL or body
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    // If not in URL, try body
    if ($id <= 0) {
        $data = json_decode(file_get_contents("php://input"));
        $id = isset($data->id) ? intval($data->id) : 0;
    }
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid observation ID"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Delete query
    $query = "DELETE FROM observations WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Observation deleted successfully"
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Observation not found"
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to delete observation"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to delete observation",
        "error" => $e->getMessage()
    ]);
}
?>
