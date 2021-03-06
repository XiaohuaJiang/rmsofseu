<?php
/**
 * Batteryinfo Add/Edit Form
 *
 * The main add/edit Batteryinfo form. Passing in 'true' as a parameter called 'edit' will result in a hidden ID field
 * allowing the user to edit an existing Batteryinfoeration setting.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.2
 * @package		app.View.Elements
 */
?>

<section class="wrapper style4 container">
	<div class="content">
		<section>
			<header>
				<h3>Enter the Batteryinfo Information Below</h3>
			</header>
			<?php
			echo $this->Form->create('Batteryinfo');
			if (isset($edit) && $edit) {
				echo $this->Form->input('id', array('type' => 'hidden'));
			}
			?>
			<div class="row">
				<section class="5u">
					<?php echo $this->Form->input('topic',  array('label' => 'robot_status_publish/Status Topic')); ?>
				</section>
				<section class="3u">
					<?php echo $this->Form->input('throttle', array('label' => 'Throttle Rate (optional)')); ?>
				</section>
				<section class="4u">
					<?php echo $this->Form->input('environment_id', array('label' => 'Environment<br />')); ?>
				</section>
			</div>
			<div class="row">
				<section class="12u">
					<?php echo $this->Form->end(array('label' => 'Save', 'class' => 'button special')); ?>
				</section>
			</div>
		</section>
	</div>
</section>
