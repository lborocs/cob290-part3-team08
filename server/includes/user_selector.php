<?php
require_once __DIR__ . '/database.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// If already have a user, show their name and bail out
if (!empty($_SESSION['user_id'])) {
    $db = new Database();
    $stmt = $db->conn->prepare(
        "SELECT first_name, second_name 
           FROM Employees 
          WHERE employee_id = :id"
    );
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $u = $stmt->fetch();
    echo "<p style='color:white;'>Logged in as: "
       . htmlspecialchars("{$u['first_name']} {$u['second_name']}")
       . "</p>";
    return;
}

// Otherwise render a single auto‑submitting dropdown:
$db   = new Database();
$emps = $db->getAllEmployees();
?>
<form method="post" style="margin:20px;">
  <label style="color:white;">
    Select user:
    <select name="user_id" onchange="this.form.submit()">
      <option value="" disabled selected>— pick one —</option>
      <?php foreach($emps as $e): ?>
        <option value="<?= $e['employee_id'] ?>">
          <?= htmlspecialchars($e['first_name'] . ' ' . $e['second_name']) ?>
        </option>
      <?php endforeach; ?>
    </select>
  </label>
</form>
