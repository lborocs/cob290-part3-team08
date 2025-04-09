<?php
$tasks = json_decode(file_get_contents("http://localhost/api/analytics/getTasks.php"), true);
?>
<h2>All Tasks</h2>
<table border="1">
    <tr>
        <th>Task</th><th>Project</th><th>Priority</th><th>Start</th><th>End</th>
    </tr>
    <?php foreach ($tasks as $task): ?>
    <tr>
        <td><?= htmlspecialchars($task['task_name']) ?></td>
        <td><?= htmlspecialchars($task['project_id']) ?></td>
        <td><?= htmlspecialchars($task['priority']) ?></td>
        <td><?= htmlspecialchars($task['start_date']) ?></td>
        <td><?= htmlspecialchars($task['finish_date']) ?></td>
    </tr>
    <?php endforeach; ?>
</table>
