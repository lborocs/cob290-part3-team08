<?php
require_once __DIR__ . '/../../server/includes/database.php';

$db = new Database();
$users = $db->getAllEmployees();

// If the form is submitted, append the user_id to the URL
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_POST['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'user_id required']);
        exit;
    }

    // Redirect to the same page with the user_id as a URL parameter
    header("Location: ?user_id=$userId");  // This appends the user_id to the URL
    exit;
}
?>

<!-- User selection form -->
<form method="POST" action="<?= $_SERVER['PHP_SELF'] ?>" style="margin-bottom: 20px;">
    <label for="userSelect">Select User:</label>
    <select name="user_id" id="userSelect" onchange="this.form.submit()">
        <option value="">-- Choose User --</option>
        <?php foreach ($users as $user): ?>
            <option value="<?= $user['employee_id'] ?>" 
                <?= isset($_GET['user_id']) && $_GET['user_id'] == $user['employee_id'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($user['first_name'] . ' ' . $user['second_name']) ?>
            </option>
        <?php endforeach; ?>
    </select>
</form>
