<?php
require_once __DIR__ . '/database.php';

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : null;

$db = new Database();

if ($userId) {
    $stmt = $db->conn->prepare(
        "SELECT first_name, second_name 
         FROM employees 
         WHERE employee_id = :id"
    );
    $stmt->execute(['id' => $userId]);
    $u = $stmt->fetch();

    if ($u) {
        echo "<p style='color:white;'>Logged in as: "
           . htmlspecialchars("{$u['first_name']} {$u['second_name']}") . "</p>";
    } else {
        echo "<p style='color:red;'>User not found.</p>";
    }

    
}

$emps = $db->getAllEmployees();
?>

<form method="get" action="<?= htmlspecialchars($_SERVER['PHP_SELF']) ?>" style="margin:20px;">
  <label style="color:white;">
    Select user:
    <select name="user_id" onchange="this.form.submit()">
      <option value="" disabled <?= !$userId ? 'selected' : '' ?>>— pick one —</option>
      <?php foreach ($emps as $e): ?>
        <option value="<?= $e['employee_id'] ?>" <?= $userId == $e['employee_id'] ? 'selected' : '' ?>>
          <?= htmlspecialchars($e['first_name'] . ' ' . $e['second_name']) ?>
        </option>
      <?php endforeach; ?>
    </select>
  </label>
</form>
