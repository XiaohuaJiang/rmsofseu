var vel_x = 0;
var vel_z = 0;
var ros;
function pub_vel(v_x,v_z)			//发布速度topic
{
	var robot_vel = new ros.Topic({
  	name        : '/RosAria/cmd_vel', 
	messageType : 'geometry_msgs/Twist'
	});
	var vel_publish = new ros.Message({
	linear:{x  :  v_x,
		y  :  0,
		z  :  0
	},
	angular:{x  : 0,
		y  :  0,
		z  : v_z
	}
	});
	robot_vel.publish(vel_publish);
}
function handleKey(code, down) 		//键盘响应事件
{
     var scale = 0;
     if (down == true) 
     {
         scale = 1;
     }
     switch (code) 
     {
         case 37:
            vel_z = 1 * scale;	            //left
         break;
         case 38:
            vel_x = 0.5 * scale;	            //up
         break;
         case 39:
            vel_z = -1 * scale;		    //right 
         break;
         case 40:
            vel_x = -0.5 * scale;	            //down
         break;
	 case 32:			    //stop
	    vel_x = 0;
	    vel_z = 0;
	 break;
	 default:
	    vel_x = 0;
	    vel_z = 0;
	 break;
     }
     pub_vel(vel_x,vel_z);
 }
function up_onclick()				//两种方式，键盘+按钮，键盘按下发布，按钮按一次发布
{
	vel_x = 0.5;		//上
	pub_vel(vel_x,vel_z);
	vel_x = 0;
}
function down_onclick()
{
	vel_x = -0.5;		//下
	pub_vel(vel_x,vel_z);
	vel_x = 0;
}
function left_onclick()
{
	vel_z = 1;		//左
	pub_vel(vel_x,vel_z);
	vel_z = 0;
}
function right_onclick()
{
	vel_z = -1;		//右
	pub_vel(vel_x,vel_z);
	vel_z = 0;
}
function stop_onclick()
{
	vel_x = 0;
	vel_z = 0;
	pub_vel(vel_x,vel_z);
}
