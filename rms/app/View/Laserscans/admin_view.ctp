<?php
/**
 * Admin Maker View
 *
 * The laserscan view allows an admin to see the laserscan topic in a viewer.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.View.Laserscans
 */
?>

<?php
// setup the ROS connection
echo $this->Rms->ros(
	__(
		'%s://%s:%d',
		h($laserscan['Environment']['Rosbridge']['Protocol']['name']),
		h($laserscan['Environment']['Rosbridge']['host']),
		h($laserscan['Environment']['Rosbridge']['port'])
	),
	h($laserscan['Environment']['Rosbridge']['rosauth'])
);
// setup the TF client
echo $this->Rms->tf(
	$laserscan['Environment']['Tf']['frame'],
	$laserscan['Environment']['Tf']['angular'],
	$laserscan['Environment']['Tf']['translational'],
	$laserscan['Environment']['Tf']['rate']
);
?>

<header class="special container">
	<span class="icon fa-cloud"></span>
	<h2><?php echo h($laserscan['Laserscan']['topic']); ?></h2>
</header>

<section class="wrapper style4 container">
	<div class="content center">
		<strong>
			<?php echo h($laserscan['Environment']['Rosbridge']['name']); ?>
			<?php
				echo $this->Rms->rosbridgeStatus(
					$laserscan['Environment']['Rosbridge']['Protocol']['name'],
					$laserscan['Environment']['Rosbridge']['host'],
					$laserscan['Environment']['Rosbridge']['port']
				);
			?>
		</strong>
		<?php echo $this->Rms->ros3d(); ?>
		<?php echo $this->Rms->laserscan($laserscan['Laserscan']['topic']); ?>
	</div>
</section>
