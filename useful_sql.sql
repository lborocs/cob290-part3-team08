-- Instead of deleting from database
UPDATE ChatMessages 
SET status = 'deleted', message_contents = NULL 
WHERE message_id = X;

-- Selecting messages
SELECT 
    message_id,
    chat_id,
    CASE 
        WHEN status = 'deleted' THEN '*this message was deleted*'
        WHEN sender_id IS NULL THEN '*from deleted account*'
        ELSE message_contents
    END AS display_message,
    IF(sender_id IS NULL, '*from deleted account*', sender_id) AS display_sender,
    date_time
FROM ChatMessages
WHERE chat_id = X;
