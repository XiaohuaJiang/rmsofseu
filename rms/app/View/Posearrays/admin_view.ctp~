<?php
/**
 * Admin Maker View
 *
 * The posearray view allows an admin to see the posearray topic in a viewer.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.View.Posearrays
 */
?>

<?php
// setup the ROS connection
echo $this->Rms->ros(
	__(
		'%s://%s:%d',
		h($posearray['Environment']['Rosbridge']['Protocol']['name']),
		h($posearray['Environment']['Rosbridge']['host']),
		h($posearray['Environment']['Rosbridge']['port'])
	),
	h($posearray['Environment']['Rosbridge']['rosauth'])
);
// setup the TF client
echo $this->Rms->tf(
	$posearray['Environment']['Tf']['frame'],
	$posearray['Environment']['Tf']['angular'],
	$posearray['Environment']['Tf']['translational'],
	$posearray['Environment']['Tf']['rate']
);
?>

<header class="special container">
	<span class="icon fa-cloud"></span>
	<h2><?php echo h($posearray['Posearray']['topic']); ?></h2>
</header>

<section class="wrapper style4 container">
	<div class="content center">
		<strong>
			<?php echo h($posearray['Environment']['Rosbridge']['name']); ?>
			<?php
				echo $this->Rms->rosbridgeStatus(
					$posearray['Environment']['Rosbridge']['Protocol']['name'],
					$posearray['Environment']['Rosbridge']['host'],
					$posearray['Environment']['Rosbridge']['port']
				);
			?>
		</strong>
		<?php echo $this->Rms->ros3d(); ?>
		<?php echo $this->Rms->posearray($posearray['Posearray']['topic']); ?>
	</div>
</section>
