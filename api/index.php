<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    // Include db.php to connect to the database
    require_once 'db.php';

    // Path to the schema.sql file
    $schemaPath = __DIR__ . '/../src/assets/database/schema.sql';

    // Read the contents of the schema file
    if (!file_exists($schemaPath)) {
        throw new Exception("Schema file not found: $schemaPath");
    }

    $schema = file_get_contents($schemaPath);

    // Split SQL commands (assuming multiple statements are separated by ;)
    $commands = array_filter(array_map('trim', explode(';', $schema)));

    // Execute each command
    foreach ($commands as $command) {
        if (!empty($command)) {
            $pdo->exec($command);
        }
    }

    // Respond with success
    echo json_encode([
        'success' => true,
        'message' => 'Database initialized successfully',
    ]);
} catch (PDOException $e) {
    // Handle database-specific errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
    ]);
} catch (Exception $e) {
    // Handle general errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
