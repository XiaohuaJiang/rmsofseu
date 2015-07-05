<?php
/**
 * Admin Maker View
 *
 * The gridcell view allows an admin to see the gridcell topic in a viewer.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.View.Gridcells
 */
?>

<?php
// setup the ROS connection
echo $this->Rms->ros(
	__(
		'%s://%s:%d',
		h($gridcell['Environment']['Rosbridge']['Protocol']['name']),
		h($gridcell['Environment']['Rosbridge']['host']),
		h($gridcell['Environment']['Rosbridge']['port'])
	),
	h($gridcell['Environment']['Rosbridge']['rosauth'])
);
// setup the TF client
echo $this->Rms->tf(
	$gridcell['Environment']['Tf']['frame'],
	$gridcell['Environment']['Tf']['angular'],
	$gridcell['Environment']['Tf']['translational'],
	$gridcell['Environment']['Tf']['rate']
);
?>

<header class="special container">
	<span class="icon fa-cloud"></span>
	<h2><?php echo h($gridcell['Gridcell']['topic']); ?></h2>
</header>

<section class="wrapper style4 container">
	<div class="content center">
		<strong>
			<?php echo h($gridcell['Environment']['Rosbridge']['name']); ?>
			<?php
				echo $this->Rms->rosbridgeStatus(
					$gridcell['Environment']['Rosbridge']['Protocol']['name'],
					$gridcell['Environment']['Rosbridge']['host'],
					$gridcell['Environment']['Rosbridge']['port']
				);
			?>
		</strong>
		<?php echo $this->Rms->ros3d(); ?>
		<?php echo $this->Rms->gridcell($gridcell['Gridcell']['topic']); ?>
	</div>
</section>
