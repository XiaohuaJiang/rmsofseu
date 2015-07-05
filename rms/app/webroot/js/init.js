var map_viewer;
function map_init()	//构建地图初始化
{
	map_viewer = new ROS2D.Viewer({
		divID : 'map',
		width : 450,
		height : 486
		});
	var gridClient = new ROS2D.OccupancyGridClient({
      		ros : _ROS,
      		rootObject : map_viewer.scene
    	});
	gridClient.on('change', function(){
      		map_viewer.scaleToDimensions(gridClient.currentGrid.width,gridClient.currentGrid.height);
    	});
}


function nav2d_init()	//2D导航初始化
{
	
	map_viewer = new ROS2D.Viewer({
		divID : 'ros2dmap',
		width : 350,
		height : 248,
		});
	var nav = NAV2D.OccupancyGridClientNav({
        ros : _ROS,
        rootObject : map_viewer.scene,
        viewer : map_viewer,
	withOrientation:true
    });
}
function nav3d_init()	//3Dmap
{
	
	map_viewer = new ROS3D.Viewer({
		divID : 'ros3dmap',
		width : 350,
		height : 248,
		antialias : true
	});
	map_viewer.addObject(new ROS3D.Grid());
	var nav3d_gridClient = new ROS3D.OccupancyGridClient({
        ros : _ROS,
        rootObject : map_viewer.scene
    });
}
function rosmap() {
		//var w=Math.min($("#map").parent().width(), 5000000);
		
		var nav3d_viewer = new ROS3D.Viewer({
		divID : 'map',
		width : 450,
		height : 486,
		antialias : true
	});
		nav3d_viewer.addObject(new ROS3D.Grid());
		var nav3d_gridClient = new ROS3D.OccupancyGridClient({
        	ros : _ROS,
       		 rootObject : nav3d_viewer.scene
   		 });
			
}

function map_select()
{
	var map_obj = document.getElementById("map_combobox");
	var index = map_obj.selectedIndex;
	switch(index)
	{
		case 1:
			nav2d_init();
			break;
		case 2:
			nav3d_init();
			break;
		case 3:
			
			component_widget_add(map_viewer.scene,"Perception",14,-18,90);
			component_widget_add(map_viewer.scene,"Perception",14,-14,90);
			component_widget_add(map_viewer.scene,"Perception",14,-10,90);
			component_widget_add(map_viewer.scene,"Perception",12,-8.5,180);
			component_widget_add(map_viewer.scene,"Perception",8,-8.5,220);
			component_widget_add(map_viewer.scene,"Perception",8,-13.5,270);
			component_widget_add(map_viewer.scene,"Perception",9,-20,310);
			break;
		default:
			break;
	}
}
function map2d_update()		
{
	  // subscribe to the topic
  
}
function startTask(){
		$("#task_ask").dialog({
		//bgiframe:true,
		resizable:false,
		//modal:true,
		/*overlay:{
			backgroundColor:'#000',
			opacity:0.5
		},*/
		position: 'center',
		draggable: true,
      		autoOpen: false,
			width : 450,
			height : 180,
			title: "Please Select the Task Command",
      		show: {
        		effect: "blind",
        		duration: 1000
      		      },
      		hide: {
        		effect: "blind",
        		duration: 1000
		      },
		buttons:{
			'StartMapping':function(){
			var topic = new ROSLIB.Topic({
				ros : _ROS,
				name : '/taskService',
				messageType : 'std_msgs/String'
				
			});
			var msg = new ROSLIB.Message({
				data : "StartMapping"
			     });
			topic.publish(msg);
			
			//$(this).dialog('close');
		},
			'StartExploring':function(){
			var topic = new ROSLIB.Topic({
				ros : _ROS,
				name : '/taskService',
				messageType : 'std_msgs/String'
				
			});
			var msg = new ROSLIB.Message({
				data : "StartExploring"
			     });
			topic.publish(msg);
			//$(this).dialog('close');
		},
			'Stop':function(){
			var topic = new ROSLIB.Topic({
				ros : _ROS,
				name : '/taskService',
				messageType : 'std_msgs/String'
				
			});
			var msg = new ROSLIB.Message({
				data : "Stop"
			     });
			topic.publish(msg);
			//$(this).dialog('close');
		},
			'SubscribeStatus':function(){
			var topic0 = new ROSLIB.Topic({
				ros : _ROS,
				name : '/robot/status',
                               
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
				var Message=new Object();
				var Position="("+message.myX.toFixed(2)+","+message.myY.toFixed(2)+","+message.myY.toFixed(2)+")";
				var Velocity = "("+message.V_x.toFixed(2)+","+message.V_y.toFixed(2)+")";
				var Orientation="("+message.my_O_x.toFixed(2)+","+message.my_O_y.toFixed(2)+","+message.my_O_z.toFixed(2)+","+message.my_O_w.toFixed(2)+")";
				var RobotPower = message.robot_power.toFixed(2)+"%";
				var EnvironmentTemperature=message.Indoor_temperature.toFixed(2)+"C";
				var AngularVelocity=message.A_z.toFixed(2);
				var WifiStrength = (2*message.wifi-113).toFixed(2)+"dBm";
				var PacketLossRate=(((message.mycount-recv_count+1)/(message.mycount-first_wifi))*100).toFixed(2)+"%";
				Message.Position=Position;
				Message.Orientation=Orientation;
				Message.Velocity=Velocity;
				Message.AngularVelocity = AngularVelocity;
				Message.RobotPower = RobotPower;
				Message.EnvironmentTemperature=EnvironmentTemperature;	
				Message.WifiStrength = WifiStrength;
				Message.PacketLossRate = PacketLossRate;
				$('#speed').html(RMS.prettyJson(Message));
				

			});
			//$(this).dialog('close');
		}
		}
		});
		

			var tmp_dialog = document.getElementById("task_ask");
			//tmp_dialog.textContent = "";
			$("#task_ask").dialog("open");
				
	}
function StartMapping()
{
	var topic = new ROSLIB.Topic({
		ros : _ROS,
		name : '/taskService',
		messageType : 'std_msgs/String'
		
	});
	var msg = new ROSLIB.Message({
		data : "StartMapping"
	     });
	topic.publish(msg);
}
function StartExploring()
{
	var topic = new ROSLIB.Topic({
		ros : _ROS,
		name : '/taskService',
		messageType : 'std_msgs/String'
		
	});
	var msg = new ROSLIB.Message({
		data : "StartExploring"
	     });
	topic.publish(msg);
}
function SubscribeStatus()
{
	var topic0 = new ROSLIB.Topic({
		ros : _ROS,
		name : '/robot/status',
               
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
		var Message=new Object();
		var Position="("+message.myX.toFixed(2)+","+message.myY.toFixed(2)+","+message.myY.toFixed(2)+")";
		var Velocity = "("+message.V_x.toFixed(2)+","+message.V_y.toFixed(2)+")";
		var Orientation="("+message.my_O_x.toFixed(2)+","+message.my_O_y.toFixed(2)+","+message.my_O_z.toFixed(2)+","+message.my_O_w.toFixed(2)+")";
		var RobotPower = message.robot_power.toFixed(2)+"%";
		var EnvironmentTemperature=message.Indoor_temperature.toFixed(2)+"C";
		var AngularVelocity=message.A_z.toFixed(2);
		var WifiStrength = (2*message.wifi-113).toFixed(2)+"dBm";
		var PacketLossRate=(((message.mycount-recv_count+1)/(message.mycount-first_wifi))*100).toFixed(2)+"%";
		Message.Position=Position;
		Message.Orientation=Orientation;
		Message.Velocity=Velocity;
		Message.AngularVelocity = AngularVelocity;
		Message.RobotPower = RobotPower;
		Message.EnvironmentTemperature=EnvironmentTemperature;	
		Message.WifiStrength = WifiStrength;
		Message.PacketLossRate = PacketLossRate;
		$('#speed').html(RMS.prettyJson(Message));
		

	});
}
function RobotStop()
{
	var topic = new ROSLIB.Topic({
		ros : _ROS,
		name : '/taskService',
		messageType : 'std_msgs/String'
		
	});
	var msg = new ROSLIB.Message({
		data : "Stop"
	     });
	topic.publish(msg);
}
function ExploreUnknownEnvironment()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
		data : "EUE"
	     });
        topic.publish(msg);
	
	
}
function NavigationInKnownEnvironment()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
		data : "NKE"
	     });
        topic.publish(msg);
}
function Mob_Mea()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
                data : "MM"
             });
        topic.publish(msg);
	
}
function Nav_Wall()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
                data : "NW"
             });
        topic.publish(msg);
}
function Fet_Cup()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
                data : "FC"
             });
        topic.publish(msg);
}
function TaskSelect()
{
	var task_obj=document.getElementById("TaskCombobox");
	var task_index=task_obj.selectedIndex;
	
	switch(task_index)
	{
		case 1:
			ExploreUnknownEnvironment();
			//sleep(1)
			//var t=setTimeout("PageUpdate()",5000);
			var nav = NAV2D.OccupancyGridClientNav({
			ros : _ROS,
			rootObject : _VIEWER2D.scene,
			viewer : _VIEWER2D,
			withOrientation:true,
			continuous:true
			});
			
			//startTask();
			break;
		case 2:
			NavigationInKnownEnvironment();
			var nav = NAV2D.OccupancyGridClientNav({
			ros : _ROS,
			rootObject : _VIEWER2D.scene,
			viewer : _VIEWER2D,
			withOrientation:true			
			});
			//var t=setTimeout("PageUpdate()",1000);
			break;
		case 3:
			Fet_Cup();
			break;
		case 4: Mob_Mea();
		default:
			break;
	}
}
function PageUpdate()
{
	document.location.href="/MyRobotInterface/view/2";
	var t=setTimeout("startTask()",10000);
}
function TaskStop()
{
	var topic = new ROSLIB.Topic({
                ros : _ROS,
                name : '/task',
                messageType : 'std_msgs/String'
                
        });
	var msg = new ROSLIB.Message({
                data : "STOP"
             });
        topic.publish(msg);
	
}
function debug_button_onclick()
{
	startTask();
}
