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
			<canvas id="zone" width="700" height="700" style="background-color:#C0C0C0;margin:0 auto;">
				Désolé, votre navigateur (ou sa version) ne prend pas en charge les "canvas".
			</canvas>
			<script src="game/game.js"></script>
			<script>
				window.onload = function() {
					var game = new Game('#zone');
					initKeyboardController(game);
					game.start();
				}
			</script>
			
		</main>

		<?php 
			include('inc/footer.php');
		?>

		<script></script>

	</body>

</html>
