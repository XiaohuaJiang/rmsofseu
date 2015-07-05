<?php
/**
 * Admin Edit Laserscan View
 *
 * The edit laserscan view allows an admin to edit an existing laserscan setting in the database.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.View.Laserscans
 */
?>

<header class="special container">
	<span class="icon fa-pencil"></span>
	<h2>Edit Laserscan Setting</h2>
</header>

<?php echo $this->element('laserscan_form', array('edit' => true)); ?>
