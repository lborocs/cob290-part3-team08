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

    .navbar-brand {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .navbar-links {
        display: flex;
        gap: 20px;
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

<nav class="navbar" id="navbar">
    <div class="navbar-brand">Make It All</div>
    <div class="navbar-links" id="navbarLinks">
        <a href="index.php">Dashboard</a>
        <a href="chatSystem.php">Chats</a>
        <a href="dataAnalytics.php">Profile</a>
    </div>
</nav>

