<?php
if($environment['Rosbridge']['host']) {
	echo $this->Rms->ros($environment['Rosbridge']['uri'], $environment['Rosbridge']['rosauth']);
}
echo $this->Rms->initStudy(); 
//echo $this->Rms->ros($environment['Rosbridge']['uri']); 
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
		$("#node_refresh").button({
			icons: {
        			primary: "ui-icon-refresh",
      				},
			text: false
		});
		$("#task_stop").button({
			icons: {
        			primary: "ui-icon-circle-close",
      				},
      			text: false
		});
		$("#node_list").accordion({
			heightStyle: "content",
			collapsible: true
		});
		$("#srv_detail").dialog({
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
		$("#camera_detail").dialog({
      		autoOpen: false,
			width : 350,
			height : 280,
			title: null,
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
		var node_listener;
		var map_viewer;

		widget_init();
		component_init();
  	}

</script>


<section id="section1" class=" wrapper style5 ">

        
	<div >
                    
			<!--p>
				<input id="send1" class="button hot" type="button" onclick="send1();" value="Forward " />
				<input id="send2" class="button hot" type="button" onclick="send2();" value="Backward" />
				<input id="send3" class="button hot" type="button" onclick="send3();" value="Left    " />
				<input id="send4" class="button hot" type="button" onclick="send4();" value="Right   " />
				<input id="send5" class="button hot" type="button" onclick="send5();" value="Stop    " />
			</p-->	
				
	</div>
       
<body onLoad="init()">
	<!--div id = "node_panel">
		<label id="node_control_panel">Node Manage Panel</label>
		<div id = "node_list"></div>
		<div id = "srv_detail" title="Service Detail"></div>
		<button id = "node_refresh" onclick = "component_update()"></button>
	</div-->
	<div id = "map">
		
	</div>
			<!--?php echo $this->Rms->ros3dmap(); ?-->
		
	<p><input id="startBtn" type="button" onclick="startTool();" value="设定目标" /><input id="clear" type="button" onclick="select3dmap();" value="三维视角" /><input id="CameraBtn" type="button" onclick="startCamera();" value="开启监控" /><input id="get_map" type="button" onclick="start_exploring();" value="二维视角"/></p>
	<!--a href="/AnyChatWebDemoInterface/view/3" target="_blank"><input id="voicecontrol" type="button" value="开启声控"/></a-->
	

  	<!--div id = "map_panel">
		<select id = "map_combobox" onchange ="map_select()">
			<option value="">Select a map</option>
			<option value="Room_404">Add the 2D map</option>
			<option value="Room_407">Add the 3D map</option>
			<option value="Room_409">Add the camera</option>
		</select-->
		
		
		<!---button id = "map_combobox" onclick = "start_exploring()"></button-->
		
		
	<!--/div-->
	<div id = "camera_detail">
		<section class="12u stream">
					
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
					
					
		</section>
	</div>
	<div id = "task_panel">
		<select id = "task_combobox" onchange = "task_select()">
			<option value="">Please select a task</option>
			<option value="Task1">Mobile Measurement </option>
			<option value="Task2">Navigation along the wall</option>
			<option value="Task3">Fetch The Cup </option>
		</select>
		<div id = "task_status">
			<button id = "task_stop" onclick = "task_stop()"></button>
		</div>
	</div>
	<div id = "debug_panel1">
			<input type = "text" id="textdebug" name = textdebug >
	</div>
	<div id = "debug_panel2">
			<input type = "button" id = "debug_button" value = "Debug" onclick = "debug_button_onclick()">
	</div>
	<div id ="status_panel">
			<!--p>
				<label id="V_Vel" >Position </label>
				<label id="lab_x" >x: </label><input id="x_Vel" type="text" name=V_x >
				<label id="lab_y" >y: </label><input id="y_Vel" type="text" name=V_y>
				<label id="lab_z" >z: </label><input id="z_Vel" type="text"  name=V_z>
				<label id="O_Ori" >Orientation </label>
				<label id="lab_x_ori" >x: </label><input id="x_Ori"  type="text" name=O_x>
				<label id="lab_y_ori">y: </label><input id="y_Ori" type="text"  name=O_y>
				<label id="lab_z_ori">z: </label><input id="z_Ori" type="text"  name=O_z>
				<label id="lab_w_ori">w: </label><input id="w_Ori" type="text"  name=O_w>
				<label id="lab_power">Robot power :  </label><input id="power" type="text"  name=power>
				<label id="lab_power_unit" >% </label>
				<label id="lab_temperature">Temperature : </label><input id="temperature" type="text"  name=temperature>
				<label id="lab_temperature_unit" >&#8451 </label>
			</p-->
		<section>
			<fieldset class="6u">
				<legend>Position </legend>
				<ul>
					<li><label for="V_x">x:</label><input id="P_x_Vel" type="text" name=V_x ></li>
					<li><label>y:<input id="P_y_Vel" type="text" name=V_y></label></li>
					<li><label>z:<input id="P_z_Vel" type="text"  name=V_z> </label></li>
				</ul>
			</fieldset>
		</section>
	</div>
	<div id="status_O_panel">
		<section>
			<fieldset class="8u">
				<legend>Orientation </legend>
				<ul>
					<li>
						<ul>
							<li><label>x:<input id="O_x_Ori" type="text" name=O_x > </label></li>
							<li><label>z:<input id="O_z_Ori" type="text"  name=O_z> </label></li>
							<li><label for="power">Robot power(%):</label><input id="Power" type="text"  name=power></li>
						</ul>
					</li>
					<li id="list_O2">
						<ul>
							<li><label>y:<input id="O_y_Ori" type="text" name=O_y></label></li>
							<li><label>w:<input id="O_w_Ori" type="text"  name=O_w> </label></li>
							<li><label for="temperature">Temperature(&#8451):</label><input id="Temperature" type="text"  name=temperature></li>
						</ul>
					</li>
					
				</ul>
			</fieldset>
		</section>
	</div>
	
</body>
   
<script>
	var key = 1;    //开关
	function startTool(){   //开关函数
		if(key==1){
       			document.getElementById("startBtn").style.background = "green";
        		document.getElementById("startBtn").style.color = "white";
        		document.getElementById("startBtn").value = "开启状态";
        		key=0;
    		}
   		else{
        		document.getElementById("startBtn").style.background = "red";
        		document.getElementById("startBtn").value = "关闭状态";
        		key=1;
    		}
	}
        function select3dmap(){
		
		nav3d_init();
		
	}
	function startCamera(){
		
					var tmp_dialog = document.getElementById("camera_detail");
					//tmp_dialog.textContent = "";
					$("#camera_detail").dialog("open");
				
	}
	function start_exploring(){
		
					setTimeout(function(){
    					nav2d_init();			//要执行的代码                    
				},200);
				
	}

	function send1(){
				 var msg = new ROSLIB.Message({
                                        data : "FW"
                                     });
                                topic.publish(msg);
		}
	function send2(){
				 var msg = new ROSLIB.Message({
                                        data : "BK"
                                     });
                                topic.publish(msg);
		}
	function send3(){
				 var msg = new ROSLIB.Message({
                                        data : "LF"
                                     });
                                topic.publish(msg);
		}
	function send4(){
				 var msg = new ROSLIB.Message({
                                        data : "RH"
                                     });
                                topic.publish(msg);
		}
	function send5(){
				 var msg = new ROSLIB.Message({
                                        data : "SP"
                                     });
                                topic.publish(msg);
		}
</script>     
        
</section>
<section id= section2 class="6u content center">
					<?php if($environment['Rosbridge']['host']): ?>
						<?php if(count($environment['Batteryinfo']) > 0): ?>
							<?php echo $this->Rms->keyboardBatteryinfo($environment['Batteryinfo'][0]['topic']); ?>
							
							<!--pre class="6u rostopic"><code id="speed">Awaiting data...</code></pre-->
							<script>
								var topic0 = new ROSLIB.Topic({
									ros : _ROS,
									name : '<?php echo h($environment['Batteryinfo'][0]['topic']);?>'
                                                                       
								});
								var recv_count=0;
								var old_wifi=0;
								var first_wifi;
								topic0.subscribe(function(message) {
									if(recv_count==0)
										{
											recv_count=message.mycount;
											first_wifi=message.mycount;
										}
									if(message.mycount>old_wifi)
									recv_count++;
									old_wifi=message.mycount;
									//$('#speed').html(RMS.prettyJson(message));
									document.getElementById("Temperature").value=message.Indoor_temperature;

									//document.getElementById("Power").value=message.robot_power;
									document.getElementById("Power").value=message.mycount-first_wifi;
									document.getElementById("P_x_Vel").value=message.myX;
									document.getElementById("P_y_Vel").value=message.myY;
									document.getElementById("P_z_Vel").value=message.myDate;
									document.getElementById("O_x_Ori").value=(message.mycount-recv_count+1)/(message.mycount-first_wifi)*100;
									
									document.getElementById("O_y_Ori").value=message.wifi;
									document.getElementById("O_z_Ori").value=message.mycount;
									document.getElementById("O_w_Ori").value=recv_count-1;
									
								});
							</script>
                                                      <?php else: ?>
							<h2>No Associated Batteryinfo Settings Found</h2>
						<?php endif; ?>
					<?php else: ?>
						<h2>No Associated rosbridge Server Found</h2>
					<?php endif; ?>
</section>                          
<section class="6u">
					<?php if($environment['Rosbridge']['host']): ?>
						<?php if(count($environment['Teleop']) > 0): ?>
							<?php echo $this->Rms->keyboardTeleop($environment['Teleop'][0]['topic']); ?>
							<pre class="rostopic"><code id="speed1">Awaiting data...</code></pre>
							<script>
								var topic = new ROSLIB.Topic({
									ros : _ROS,
									name : '<?php echo h($environment['Teleop'][0]['topic']);?>'
								});
								topic.subscribe(function(message) {
									$('#speed1').html(RMS.prettyJson(message));
								});
							</script>
						<?php else: ?>
							<h2>No Associated Telop Settings Found</h2>
						<?php endif; ?>
					<?php else: ?>
						<h2>No Associated rosbridge Server Found</h2>
					<?php endif; ?>
				</section>
