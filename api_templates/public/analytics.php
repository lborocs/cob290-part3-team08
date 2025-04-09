<?php
$workload = json_decode(file_get_contents("http://localhost/api/analytics/getEmployeeWorkload.php?employee_id=6&start_date=2024-03-01&end_date=2024-06-01"), true);
?>
<h2>Employee Workload</h2>
<table border="1">
    <tr><th>Task</th><th>Allocated</th><th>Taken</th><th>Start</th><th>End</th></tr>
    <?php foreach ($workload as $row): ?>
    <tr>
        <td><?= htmlspecialchars($row['task_name']) ?></td>
        <td><?= htmlspecialchars($row['time_allocated']) ?> hrs</td>
        <td><?= htmlspecialchars($row['time_taken'] ?? 'N/A') ?> hrs</td>
        <td><?= htmlspecialchars($row['start_date']) ?></td>
        <td><?= htmlspecialchars($row['finish_date']) ?></td>
    </tr>
    <?php endforeach; ?>
</table>
