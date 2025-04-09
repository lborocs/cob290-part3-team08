<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = http_build_query([
        'chat_name' => $_POST['chat_name'],
        'creator_id' => $_POST['creator_id']
    ]);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded",
            'content' => $data
        ]
    ]);
    $response = file_get_contents("http://localhost/api/chats/createWithAdmin.php", false, $context);
    $result = json_decode($response, true);
    echo "Chat Created: ID = " . $result['chat_id'];
}
?>
<form method="post">
    <label>Chat Name: <input type="text" name="chat_name"></label><br>
    <label>Creator ID: <input type="number" name="creator_id" value="1"></label><br>
    <button type="submit">Create Chat</button>
</form>
