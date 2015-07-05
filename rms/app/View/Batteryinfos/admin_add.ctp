<?php
/**
 * Admin Add Batteryinfo View
 *
 * The add Batteryinfo view allows an admin to add a new Batteryinfo setting to the database.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.2
 * @package		app.View.Teleops
 */
?>

<header class="special container">
	<span class="icon fa-pencil"></span>
	<h2>Add Batteryinfo Setting</h2>
</header>

<?php echo $this->element('batteryinfo_form'); ?>
