<?php
/**
 * Admin Add Laserscan View
 *
 * The add laserscan view allows an admin to add a new laserscan setting to the database.
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
	<h2>Add Laserscan Setting</h2>
</header>

<?php echo $this->element('laserscan_form'); ?>
