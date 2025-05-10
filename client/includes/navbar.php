<style>
    .navbar {
        background-color: #0084ff;
        color: white;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }



    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        /* Makes it circular */
        object-fit: cover;
        /* Ensures the image doesn't stretch */
        border: 2px solid white;
        /* Optional white border */
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        /* Optional slight shadow */
    }


    .navbar {
        background-color: #0084ff;
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        gap: 20px;
        /* optional */
    }

    .navbar-brand {
        font-size: 1.5rem;
        font-weight: bold;
        white-space: nowrap;
    }

    .navbar-links {
        display: flex;
        gap: 20px;
        flex-grow: 1;
        /* 👈 this allows it to take space between left and right */
        justify-content: center;
        /* or: space-between / flex-start / flex-end */
    }

    .navbar-user {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
    }


    .navbar-links a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.3s;
    }

    .navbar-links a:hover {
        opacity: 0.8;
    }

    @media (max-width: 768px) {
        .navbar-links {
            flex-direction: column;
            background-color: #0073e6;
            position: absolute;
            top: 60px;
            right: 0;
            padding: 10px;
            display: none;
        }
    }
</style>

<?php if (session_status() === PHP_SESSION_NONE)
    session_start(); ?>

<?php
require_once __DIR__ . '/../../server/includes/database.php'; // adjust path as needed

$db = new Database();
$userId = $_GET['user_id'] ?? null;
$user = null;

if ($userId) {
    $stmt = $db->conn->prepare("SELECT first_name, profile_picture_path FROM Employees WHERE employee_id = :id");
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}
?>


<nav class="navbar" id="navbar">
    <div class="navbar-brand">Make It All</div>

    <div class="navbar-links" id="navbarLinks">
        <a href="/makeitall/cob290-part3-team08/client/chatSystem/ChatSystem.php">Chats</a>
        <a href="/makeitall/cob290-part3-team08/client/dataAnalytics/dataAnalytics.php">Data Analytics</a>
        <a href="/makeitall/cob290-part3-team08/client/index.php">Dashboard</a>
    </div>

    <?php if ($user): ?>
        <div class="navbar-user">
            <span class="user-name"><?= htmlspecialchars($user['first_name']) ?></span>
            <img class="user-avatar"
                src="/makeitall/cob290-part3-team08/<?= htmlspecialchars($user['profile_picture_path'] ?? 'server/images/default-avatar.png') ?>"
                alt="Profile Picture">
        </div>

    <?php endif; ?>
</nav>