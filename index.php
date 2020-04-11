<!doctype html>
<html>

	<head>
		<title>Snake It - Home</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="ressources/css/structure.css">
	</head>
	
	<body>

		<header>
			<nav id="main-menu" class="page-width">
				<?php 
					include('inc/menu.php');
				?>
			</nav>
		</header>

		<main>
			<h1>The game</h1>
			<p><?= $_SERVER['PHP_SELF'] ?></p>
		</main>

		<?php 
			include('inc/footer.php');
		?>

	</body>
</html>
