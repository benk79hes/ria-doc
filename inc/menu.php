<?php
$menu = [
    '/index.php' => 'Snake It',
    '/hall-of-fame.php' => 'Hall of Fame',
    '/help.php' => 'Help',
];
$menu_right = [
    '/login.php' => 'Login',
];
?>
<ul>
    <?php 
    foreach ($menu as $key => $value) {
        ?>
        <li <?= $key == $_SERVER['PHP_SELF'] ? 'class="active"' : ''  ?>>
            <a href="<?= $key ?>"><?= $value ?></a>
        </li>
        <?php
    }
    ?>
    <?php 
    foreach ($menu_right as $key => $value) {
        ?>
        <li class="right <?= $key == $_SERVER['PHP_SELF'] ? ' active' : ''  ?>">
            <a href="<?= $key ?>"><?= $value ?></a>
        </li>
        <?php
    }
    ?>
</ul>
