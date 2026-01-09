<?php
/**
 * DELETE - Delete snake (Admin only)
 * Endpoint: DELETE /api/snakes/delete.php?id={id}
 */

// Include CORS handler
include_once '../cors.php';

// Include auth middleware and database
include_once '../middleware/auth.php';
include_once '../../config/database.php';

try {
    // Require admin authentication
    $user = requireAuth('admin');
    
    // Get snake ID from query params or body
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        $data = json_decode(file_get_contents("php://input"));
        $id = isset($data->id) ? $data->id : null;
    }
    
    if (!$id || !is_numeric($id)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Valid snake ID is required"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if snake exists
    $checkQuery = "SELECT id, common_name FROM snakes WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Snake not found"
        ]);
        exit;
    }
    
    $snake = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    // Delete snake
    $query = "DELETE FROM snakes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Snake deleted successfully",
            "deleted" => [
                "id" => $snake['id'],
                "common_name" => $snake['common_name']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to delete snake"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to delete snake",
        "error" => $e->getMessage()
    ]);
}
?>
