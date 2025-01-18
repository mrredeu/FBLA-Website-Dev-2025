<?php
require 'db.php';

// Fetch pending accounts
$sql = "SELECT id, full_name, email, role FROM users WHERE is_approved = 0";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Approve Accounts</title>
</head>
<body>
    <h1>Pending Approvals</h1>
    <table>
        <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['full_name']) ?></td>
                <td><?= htmlspecialchars($row['email']) ?></td>
                <td><?= htmlspecialchars($row['role']) ?></td>
                <td>
                    <a href="approve_user.php?id=<?= $row['id'] ?>">Approve</a>
                </td>
            </tr>
        <?php endwhile; ?>
    </table>
</body>
</html>
