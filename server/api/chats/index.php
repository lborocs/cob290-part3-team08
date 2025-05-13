<?php
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/headers.php';

//Basically this is a RESTful API router that handles the requests in the application. 
//dependencies are above ^^ and below it checks if there is an actual user "logged in" by checking the session

$currentUser = $_GET['user_id'] ?? null;

if (!$currentUser) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}
$currentUser = isset($_GET['user_id']) ? (int) $_GET['user_id'] : null;

$db = new Database();
header('Content-Type: application/json');

//this is the path of the API and picks the HTTP method (GET, POST, PATCH, DELETE) and URI path 

$base = '/makeitall/cob290-part3-team08/server/api/chats/index.php';

//this basically gets the URI which is the Uniform Resource Identifier that the server gets from the client

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = substr($uri, strlen($base));
$parts = array_values(array_filter(explode('/', $path)));
$method = $_SERVER['REQUEST_METHOD'];

function getJson(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    return $data ?: [];
}

//this is the chat handler which is used to create a new chat, get chats for the current user 

if (count($parts) === 0) {
    if ($method === 'GET') {
        echo json_encode($db->getUserChats($currentUser));
        exit;
    }
    if ($method === 'POST') {
        $data = getJson();
        $name = trim($data['chat_name'] ?? '');
        if ($name === '') {
            http_response_code(400);
            echo json_encode(['error' => 'chat_name is required']);
            exit;
        }
        $chatId = $db->createChatWithCreator($currentUser, $name);
        http_response_code($chatId ? 201 : 500);
        echo json_encode(['chat_id' => $chatId]);
        exit;
    }
}

//handles HTTP methods
//since we need integer for database operations this converts sstring IDs to integers

if (ctype_digit($parts[0])) {
    $chatId = (int) $parts[0];

    //DELETE removes a chat from the database (fully)

    if (!$db->isUserInChat($chatId, $currentUser)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied to this chat']);
        exit;
    }

    if ($method === 'DELETE' && count($parts) === 1) {
        $db->deleteChat($chatId);
        http_response_code(204);
        exit;
    }

    // DELETE /api/chats/index.php/{chatId}/messages/{messageId}
    if ($method === 'DELETE' && count($parts) === 3 && $parts[1] === 'messages') {
        $msgId = (int) $parts[2];
        $db->deleteMessage($msgId, $currentUser); // or check permission if needed
        http_response_code(204);
        exit;
    }

    //PATCH as we can see deals with chat renaming and has some validation

    if ($method === 'PATCH' && count($parts) === 1) {
        $data = getJson();
        $nm = trim($data['chat_name'] ?? '');
        if ($nm === '') {
            http_response_code(400);
            echo json_encode(['error' => 'chat_name required']);
            exit;
        }
        $db->renameChat($chatId, $nm);
        http_response_code(204);
        exit;
    }

    //here the member endpoints are dealth with

    if (isset($parts[1]) && $parts[1] === 'members') {
        //GET returns a list of members
        if ($method === 'GET' && count($parts) === 2) {
            echo json_encode(['members' => $db->getChatMembers($chatId)]);
            exit;
        }

        //POST adds a new user, has a false (default) for admin status 
        if ($method === 'POST' && count($parts) === 2) {
            $d = getJson();
            $uid = (int) ($d['user_id'] ?? 0);
            $adm = (bool) ($d['is_admin'] ?? false);
            if (!$uid) {
                http_response_code(400);
                echo json_encode(['error' => 'user_id required']);
                exit;
            }
            $db->addUserToChat($chatId, $uid, $adm);
            http_response_code(201);
            exit;
        }

        //this updates the ADMIN status and promoting an user
        if ($method === 'PATCH' && count($parts) === 3) {
            $uid = (int) $parts[2];
            $adm = (bool) (getJson()['is_admin'] ?? false);
            $db->setAdminStatus($chatId, $uid, $adm);
            http_response_code(204);
            exit;
        }

        //Leaving chat
        if ($method === 'DELETE' && count($parts) === 3) {
            $uid = (int) $parts[2];
            
            $members = $db->getChatMembers($chatId);
            error_log(json_encode($members));
            error_log(json_encode($uid));


            // If user is removing themselves
            if ($uid == $currentUser) {

                        
                if (count($members) === 1 && $members[0]['employee_id'] == $currentUser) {
                    // Only user left – delete chat entirely
                    $ok = $db->deleteChat($chatId);
                    http_response_code($ok ? 204 : 500);
                    exit;
                }
        
                // More than 1 member – must not be last admin
                if (!$db->canLeaveChat($chatId, $uid)) {
                    http_response_code(409); // Last admin can't leave
                    echo json_encode(['error' => 'last_admin']);
                    exit;
                }
        
                // Allowed to leave
                $db->removeUserFromChat($chatId, $uid);
                http_response_code(204);
                exit;
            }
        
            // Admin removing someone else
            if (!$db->isAdmin($chatId, $currentUser)) {
                http_response_code(403);
                echo json_encode(['error' => 'Permission denied']);
                exit;
            }
        
            // Prevent removing the last admin
            if ($db->isAdmin($chatId, $uid) && !$db->canLeaveChat($chatId, $uid)) {
                http_response_code(409);
                error_log("Reached last check");
                echo json_encode(['error' => 'Cannot remove the last admin']);
                exit;
            }
        
            $db->removeUserFromChat($chatId, $uid);
            http_response_code(204);
            exit;
        }
        
    }

    //this handles the messages in the chat 
    if (isset($parts[1]) && $parts[1] === 'messages') {
        //GET returns all messages
        if ($method === 'GET' && count($parts) === 2) {
            echo json_encode($db->getChatMessages($chatId));
            exit;
        }

        //handles sending messages, does not alow empty messages 
        if ($method === 'POST' && count($parts) === 2) {
            $msg = trim(getJson()['message'] ?? '');
            if ($msg === '') {
                http_response_code(400);
                echo json_encode(['error' => 'message required']);
                exit;
            }
            $db->sendMessage($chatId, $currentUser, $msg);
            http_response_code(201);
            exit;
        }

        if ($method === 'PATCH' && count($parts) === 3) {
            $msgId = (int) $parts[2];
            $data = getJson();
            $message = $db->getMessageById($msgId);

            if (!$message) {
                http_response_code(404);
                echo json_encode(['error' => 'Message not found']);
                exit;
            }

            // Handle read receipt
            error_log(json_encode($data));

            if (isset($data['read']) && $data['read'] === true) {
                if ($message['sender_id'] != $currentUser) {
                    $db->markMessageRead($msgId, $currentUser);
                }
                http_response_code(204);
                exit;
            }

            // Handle message edit
            error_log(json_encode($data));

            if (isset($data['message_contents'])) {
                error_log("Sender ID: " . $message['sender_id']);
                error_log("Current user: " . $currentUser);
                error_log("Incoming PATCH data: " . json_encode($data));

                if ($message['sender_id'] != $currentUser) {
                    http_response_code(403);
                    echo json_encode(['error' => 'Cannot edit someone else\'s message']);
                    exit;
                }
                $ok = $db->editMessage($msgId, trim($data['message_contents']));
                http_response_code($ok ? 204 : 500);
                exit;
            }

            http_response_code(400);
            echo json_encode(['error' => 'Invalid PATCH data']);
            exit;
        }


        //used for deleting a specific message
        if ($method === 'DELETE' && count($parts) === 3) {
            $msgId = (int) $parts[2];
            $db->deleteMessage($msgId, $currentUser);
            http_response_code(204);
            exit;
        }
    }
}

http_response_code(404);
echo json_encode(['error' => 'Not Found']);
