<?php
/**
 * PUT - Update snake (Admin only)
 * Endpoint: PUT /api/snakes/update.php
 */

// Include CORS handler
include_once '../cors.php';

// Include auth middleware
include_once '../middleware/auth.php';

// Include database
include_once '../../config/database.php';

try {
    // Require admin authentication
    $user = requireAuth('admin');
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate ID
    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing snake ID"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Build dynamic update query based on provided fields
    $updateFields = [];
    $params = [':id' => intval($data->id)];
    
    if (!empty($data->common_name)) {
        $updateFields[] = "common_name = :common_name";
        $params[':common_name'] = htmlspecialchars(strip_tags($data->common_name));
    }
    
    if (!empty($data->species_name)) {
        $updateFields[] = "species_name = :species_name";
        $params[':species_name'] = htmlspecialchars(strip_tags($data->species_name));
    }
    
    if (!empty($data->venomous)) {
        $validVenomous = ['Non-venomous', 'Mildly venomous', 'Highly venomous'];
        if (in_array($data->venomous, $validVenomous)) {
            $updateFields[] = "venomous = :venomous";
            $params[':venomous'] = $data->venomous;
        }
    }
    
    if (isset($data->status)) {
        $updateFields[] = "status = :status";
        $params[':status'] = htmlspecialchars(strip_tags($data->status));
    }
    
    if (isset($data->distribution)) {
        $updateFields[] = "distribution = :distribution";
        $params[':distribution'] = htmlspecialchars(strip_tags($data->distribution));
    }
    
    if (isset($data->habitat)) {
        $updateFields[] = "habitat = :habitat";
        $params[':habitat'] = htmlspecialchars(strip_tags($data->habitat));
    }
    
    if (isset($data->description)) {
        $updateFields[] = "description = :description";
        $params[':description'] = htmlspecialchars(strip_tags($data->description));
    }
    
    if (isset($data->ecological_role)) {
        $updateFields[] = "ecological_role = :ecological_role";
        $params[':ecological_role'] = htmlspecialchars(strip_tags($data->ecological_role));
    }
    
    if (isset($data->image_url)) {
        $updateFields[] = "image_url = :image_url";
        $params[':image_url'] = htmlspecialchars(strip_tags($data->image_url));
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No fields to update"
        ]);
        exit;
    }
    
    $query = "UPDATE snakes SET " . implode(", ", $updateFields) . " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Snake updated successfully"
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Snake not found or no changes made"
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to update snake"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update snake",
        "error" => $e->getMessage()
    ]);
}
?>
