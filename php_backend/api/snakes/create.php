<?php
/**
 * POST - Create new snake (Admin only)
 * Endpoint: POST /api/snakes/create.php
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
    
    // Validate required fields
    if (
        empty($data->common_name) ||
        empty($data->species_name) ||
        empty($data->venomous)
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: common_name, species_name, venomous"
        ]);
        exit;
    }
    
    // Validate venomous enum
    $validVenomous = ['Non-venomous', 'Mildly venomous', 'Highly venomous'];
    if (!in_array($data->venomous, $validVenomous)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid venomous value. Must be: Non-venomous, Mildly venomous, or Highly venomous"
        ]);
        exit;
    }
    
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Insert query
    $query = "INSERT INTO snakes 
              (common_name, species_name, venomous, status, distribution, habitat, description, ecological_role, image_url) 
              VALUES 
              (:common_name, :species_name, :venomous, :status, :distribution, :habitat, :description, :ecological_role, :image_url)";
    
    $stmt = $db->prepare($query);
    
    // Sanitize and bind values
    $common_name = htmlspecialchars(strip_tags($data->common_name));
    $species_name = htmlspecialchars(strip_tags($data->species_name));
    $venomous = $data->venomous;
    $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : 'Least concern';
    $distribution = isset($data->distribution) ? htmlspecialchars(strip_tags($data->distribution)) : null;
    $habitat = isset($data->habitat) ? htmlspecialchars(strip_tags($data->habitat)) : null;
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
    $ecological_role = isset($data->ecological_role) ? htmlspecialchars(strip_tags($data->ecological_role)) : null;
    $image_url = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : null;
    
    $stmt->bindParam(':common_name', $common_name);
    $stmt->bindParam(':species_name', $species_name);
    $stmt->bindParam(':venomous', $venomous);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':distribution', $distribution);
    $stmt->bindParam(':habitat', $habitat);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':ecological_role', $ecological_role);
    $stmt->bindParam(':image_url', $image_url);
    
    if ($stmt->execute()) {
        $lastId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Snake created successfully",
            "id" => $lastId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to create snake"
        ]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to create snake",
        "error" => $e->getMessage()
    ]);
}
?>
