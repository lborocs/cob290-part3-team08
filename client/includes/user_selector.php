<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../../server/includes/database.php';

$db = new Database();
$users = $db->getAllEmployees(); 

$currentUserId = $_SESSION['user_id'] ?? '';
?>

<form method="POST" action="<?= $_SERVER['PHP_SELF'] ?>" style="margin-bottom: 20px;">
    <label for="userSelect">Select User:</label>
    <select name="user_id" id="userSelect" onchange="this.form.submit()">
        <option value="">-- Choose User --</option>
        <?php foreach ($users as $user): ?>
            <option value="<?= $user['employee_id'] ?>"
                <?= ($user['employee_id'] == $currentUserId) ? 'selected' : '' ?>>
                <?= htmlspecialchars($user['first_name'] . ' ' . $user['second_name']) ?>
            </option>
        <?php endforeach; ?>
    </select>
</form>
