<?php
// Include the database connection
include 'db.php';

// Handle approval or cancellation actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['approve']) && isset($_POST['id'])) {
        try {
            $id = intval($_POST['id']); // Get account ID
            $sql = "UPDATE users SET is_approved = 1 WHERE id = :id"; // Approve account
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            echo "<script>alert('Account approved successfully!');</script>";
        } catch (PDOException $e) {
            die("Approval error: " . $e->getMessage());
        }
    }

    if (isset($_POST['cancel']) && isset($_POST['id'])) {
        try {
            $id = intval($_POST['id']); // Get account ID
            $sql = "UPDATE users SET is_approved = -1 WHERE id = :id"; // Cancel account
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            echo "<script>alert('Account cancelled successfully!');</script>";
        } catch (PDOException $e) {
            die("Cancellation error: " . $e->getMessage());
        }
    }
}

try {
    // Query the database for accounts that are not approved
    $sql = "SELECT * FROM users WHERE is_approved = 0";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Accounts</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #F3E3BC;
        }

        .rv-container {
            padding: 20px;
            max-width: 800px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .rv-container h1 {
            color: #333;
        }

        .rv-account {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            background-color: #fefefe;
        }

        .rv-account h2 {
            margin: 0;
            font-size: 18px;
            color: #444;
        }

        .rv-account p {
            margin: 5px 0;
            color: #666;
        }

        .rv-actions {
            margin-top: 10px;
        }

        .rv-actions form {
            display: inline-block;
        }

        .rv-actions button {
            padding: 8px 12px;
            margin-right: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .rv-actions button.approve {
            background-color: #4CAF50;
            color: #fff;
        }

        .rv-actions button.cancel {
            background-color: #f44336;
            color: #fff;
        }
    </style>
</head>
<body>
    <?php include 'navbar.php'; ?>  
    <div class="rv-container">
        <h1>Review Pending Accounts</h1>
        <?php if (!empty($accounts)): ?>
            <?php foreach ($accounts as $account): ?>
                <div class="rv-account">
                    <h2><?php echo htmlspecialchars($account['full_name']); ?></h2>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($account['email']); ?></p>
                    <p><strong>Role:</strong> <?php echo htmlspecialchars($account['role']); ?></p>
                    <div class="rv-actions">
                        <!-- Approve Button -->
                        <form method="post">
                            <input type="hidden" name="id" value="<?php echo $account['id']; ?>">
                            <button type="submit" name="approve" class="approve">Approve</button>
                        </form>
                        <!-- Cancel Button -->
                        <form method="post">
                            <input type="hidden" name="id" value="<?php echo $account['id']; ?>">
                            <button type="submit" name="cancel" class="cancel">Deny</button>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No pending accounts to review.</p>
        <?php endif; ?>
    </div>
</body>
</html>