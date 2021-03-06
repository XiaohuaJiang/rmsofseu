<?php
/**
 * MyRobot Interface View
 *
 * The MyRobot Interface displays a camera feed and keyboard teleop.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.View.BasicInterface
 */
echo "<script>location:reload();</script>";
?>

<?php
// setup the main ROS connection and any study information
if($environment['Rosbridge']['host']) {
	echo $this->Rms->ros($environment['Rosbridge']['uri'], $environment['Rosbridge']['rosauth']);
}
echo $this->Rms->initStudy();
?>

<script>
        var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/echo',
                messageType : 'std_msgs/String'
                
        });
</script>

<header class="special container">
        <span class="icon fa-cloud"></span>
        <h2>MyRobotInterface Teleop</h2>
</header>


<script>
	
	function widget_init()
	{
		$("#NodeRefresh").button({
			icons: {
        			primary: "ui-icon-refresh",
      				},
			text: false
		});
		$("#TaskStop").button({
			icons: {
        			primary: "ui-icon-circle-close",
      				},
      			text: false
		});
		$("#TaskServiceDialog").button({
			icons: {
        			//primary: "ui-icon-extlink",
				primary: "ui-icon-carat-2-n-s",
      				},
      			text: false
		});
		$("#StartMapping").button({
			icons: {
        			//primary: "ui-icon-extlink",
				primary: "ui-icon-squaresmall-plus",
      				},
      			text: false
		});
		$("#StartExploring").button({
			icons: {
        			//primary: "ui-icon-extlink",
				primary: "ui-icon-triangle-1-n",
      				},
      			text: false
		});
		$("#SubscribeStatus").button({
			icons: {
        			//primary: "ui-icon-extlink",
				primary: "ui-icon-mail-open",
      				},
      			text: false
		});
		$("#RobotStop").button({
			icons: {
        			//primary: "ui-icon-extlink",
				primary: "ui-icon-stop",
      				},
      			text: false
		});
		$("#NodeList").accordion({
			heightStyle: "content",
			collapsible: true
		});
		$("#SrvDetail").dialog({
      		autoOpen: false,
      		show: {
        		effect: "blind",
        		duration: 1000
      		      },
      		hide: {
        		effect: "blind",
        		duration: 1000
		      }
		
		});
		
		
	}
	function init() 
	{
    	//var ros;	//ros对象
		var NodeListener;
		var map_viewer;

		widget_init();
		//component_init();
  	}
	function Nav2dInit()
	{
		var nav = NAV2D.OccupancyGridClientNav({
		ros : _ROS,
		rootObject : _VIEWER2D.scene,
		viewer : _VIEWER2D,
		withOrientation:true
		});
	}

</script>

<section class="wrapper style4 container">
	<div class="content center">
		<section>
			<header>
				<p class="third icon">Use the <strong class="first icon">W, A, S, D, Q, E</strong> keys to drive your robot. </p>
			</header>
			<body onLoad="init()">
				
				<div class="row">
					<section class="4u stream">
						<label class="second icon">2D Environment</label>
						<?php if($environment['Rosbridge']['host']): ?>
							<?php if(count($environment['Teleop']) > 0): ?>
								<?php echo $this->Rms->keyboardTeleop($environment['Teleop'][0]['topic']); ?>
							<?php else: ?>
							<?php endif; ?>
						<?php else: ?>
							<h2>No Associated rosbridge Server Found</h2>
						<?php endif; ?>
						<?php echo $this->Rms->ros2d()?>
						<!--div id="_VIEWER2D">
						<script>
							//setInterval(Nav2dInit,200);
							
						    	var nav = NAV2D.OccupancyGridClientNav({
							ros : _ROS,
							rootObject : _VIEWER2D.scene,
							viewer : _VIEWER2D,
							withOrientation:true,
							continuous:true
							});

						</script>
						</div-->
					</section>
					<section class="4u stream">
						<label class="second icon">3D Environment</label>
						<?php echo $this->Rms->ros3d()?>
						
						<script>
							_VIEWER.addObject(new ROS3D.Grid());
							var nav3d_gridClient = new ROS3D.OccupancyGridClient({
							ros : _ROS,
							continuous: true,
							rootObject : _VIEWER.scene
						    });
							
							var _TF=new ROSLIB.TFClient({
							ros: _ROS,
							angularThres:0.010000,
							transThres:0.010000,
							rate:10.000000,
							fixedFrame:"/base_link"
						});
							/*var nav3d_marker = new ROS3D.MarkerClient({
							ros : _ROS,
							tfClient: _TF,
							rootObject : _VIEWER.scene,
							topic: "/visualization_marker"
						    });*/
						

						</script>
						<?php echo $this->Rms->marker("/visualization_marker"); ?><!--效果等同与上面隐掉的部分-->
						<?php echo $this->Rms->marker("/visualization_marker2"); ?>
						<?php echo $this->Rms->marker("/visualization_marker3"); ?>
						<?php echo $this->Rms->marker("/Mapper/vertices"); ?>
						<?php echo $this->Rms->marker("/Mapper/edges"); ?>
						<!--?php echo $this->Rms->urdf($environment['Urdf'][0]['param'], $environment['Urdf'][0]['Collada']['id'], $environment['Urdf'][0]['Resource']['url']); ?-->
						<?php echo $this->Rms->interactiveMarker("/basic_controls",null,null); ?>
					</section>
					<section class="4u stream">
						<label class="second icon">Monitoring Video</label>
						<?php if($environment['Mjpeg']['host']): ?>
							<?php if(count($environment['Stream']) > 0): ?>
								<?php
								echo $this->Rms->mjpegStream(
									$environment['Mjpeg']['host'],
									$environment['Mjpeg']['port'],
									$environment['Stream'][0]['topic'],
									$environment['Stream'][0]
								);
								?>
							<?php else: ?>
								<h2>No Associated MJPEG Streams Found</h2>
							<?php endif; ?>
						<?php else: ?>
							<h2>No Associated MJPEG Server Found</h2>
						<?php endif; ?>
						<!--style type="text/css">
							viewer {height: 200pt;}
						</style-->
					</section>
				
				
				</div>
				<div class="row">
					
					<section class="4u">
						<label class="second icon">Node Manage Panel</label>
						<div id = "NodePanel">
						<!--label id="NodeControlPanel" >Node Manage Panel</label-->
						<div id = "SrvDetail" title="Service Detail" ></div>
						<button id = "NodeRefresh" onclick = "component_update()" ></button>
						<div id = "NodeList" ></div>
						</div>
					
					</section>
					
				
					
					<section class="4u">
					<label class="second icon">The Status Information</label>
					<?php if($environment['Rosbridge']['host']): ?>
						<?php if(count($environment['Batteryinfo']) > 0): ?>
							<?php echo $this->Rms->keyboardBatteryinfo($environment['Batteryinfo'][0]['topic']); ?>
							
							<pre class="12u rostopic"><code id="speed"><strong>Awaiting robot status information data...</strong>







</code></pre>
							<script>
								/*var topic1 = new ROSLIB.Topic({
									ros : _ROS,
									name : '<?php echo h($environment['Batteryinfo'][0]['topic']);?>'
                                                                       
								});
								topic1.subscribe(function(message) {
									
									$('#speed').html(RMS.prettyJson(message));
									

								});*/
							</script>
                                                      <?php else: ?>
							<h2>No Associated Batteryinfo Settings Found</h2>
						<?php endif; ?>
					<?php else: ?>
						<h2>No Associated rosbridge Server Found</h2>
					<?php endif; ?>
					</section>
					<!--section class="4u">
						<div id = "TaskPanel">
							<select id = "TaskCombobox" onchange = "TaskSelect()">
								<option value="">Please select a task</option>
								<option value="Task1">Expore The Unknown Environment</option>
								<option value="Task2">Navigation in a known environment</option>
								<option value="Task3">Fetch The Cup </option>
								<option value="Task4">Mobile Measurement  </option>
							</select>
							<div id = "TaskStatus">
								<button id = "TaskStop" onclick = "TaskStop()"></button>
							</div>
						</div>
						<div id = "DebugPanel1">
								<input type = "text" id="TextDebug" >
						</div>
						<div id = "DebugPanel2">
							<input type = "button" id = "DebugButton" value = "Debug" onclick = "debug_button_onclick()">
						</div>
						
					</section-->
					<section class="4u">
						<label class="second icon">Task Manage Panel</label>
						<div  class="row">
							<div class="4u"/>
							<select id = "TaskCombobox" onchange = "TaskSelect()" class="4u">
								<option value="">Please select a task</option>
								<option value="Task1">Autonomous Exploring</option>
								<option value="Task2">Navigation in a Known Environment</option>
								<option value="Task3">Wall-Following Navigation </option>
								<option value="Task4">Autonomous Path Tracking </option>
							</select>
						</div>
						<div>
							<div>	
								<div id = "TaskStatus"/>
							</div>
							<div>	
								<div id = "TaskButtons">
									<div>
										<button id = "TaskServiceDialog" onclick = "component_init();">Select a specific task</button>
										<button id = "TaskStop" onclick = "TaskStop()">Stop the task</button>
									
									</div>
									<div>
										<button id = "StartMapping" onclick = "StartMapping()">Start Mapping</button>									<button id = "StartExploring" onclick = "StartExploring()">Start exploring</button>
									</div>
									<div>
									<button id = "SubscribeStatus" onclick = "SubscribeStatus()">Subscribe status information</button>						
									<button id = "RobotStop" onclick = "RobotStop()">Stop the robot</button>
									</div>
									<div id="task_ask"/>
								</div>									
							</div>	
						</div>
						<div id="TextPanel">
							<section class="8u">	
								<input type = "text" id="TextDebug"/>
							</section>
							<section>
								<input type = "button" id = "DebugButton" value = "Debug" onclick = "debug_button_onclick()" />
							</section>
						</div>
						
						
					</section>
				</div>
				<div class="row">
					
				</div>
			</body>
		</section>
	</div>
</section>

