/*********************************************************************
 *
 * Software License Agreement (BSD License)
 *
 *  Copyright (c) 2012, Worcester Polytechnic Institute
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *   * Neither the name of the Worcester Polytechnic Institute nor the 
 *     names of its contributors may be used to endorse or promote 
 *     products derived from this software without specific prior 
 *     written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 *  FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 *  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 *
 *   Author: Russell Toris
 *  Version: October 8, 2012
 *  
 *  Converted to AMD by Jihoon Lee
 *  Version: September 27, 2012
 *
 *********************************************************************/

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([ 'eventemitter2', 'actionclient', 'map' ], factory);	//依赖3个模块
  } else {
    root.Nav2D = factory(root.EventEmitter2, root.ActionClient, root.Map);
  }
}
    (
        this,
        function(EventEmitter2, ActionClient, Map) {
          var Nav2D = function(options) {			//定义Nav2D(options)函数
            var nav2D = this;
            options = options || {};
            nav2D.ros = options.ros;
            nav2D.serverName = options.serverName || '/move_base';	//可能/多余
            nav2D.actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
            nav2D.serverTimeout = options.serverTimeout || 5000;
            nav2D.mapTopic = options.mapTopic || '/map';
            nav2D.continuous = options.continuous;
            nav2D.canvasID = options.canvasID;		//画布ID
            // optional (used if you do not want to stream /map or use a custom image)
            nav2D.image = options.image;
            nav2D.mapMetaTopic = options.mapMetaTopic || '/map_metadata';
            // optional color settings
            nav2D.clickColor = options.clickColor || '#543210';
            nav2D.robotColor = options.robotColor || '#012345';
            nav2D.initialPoseTopic = options.initialPoseTopic || '/initialpose';	//amcl订阅

            // draw robot 
            nav2D.drawrobot = options.drawrobot;
            
            nav2D.mode = 'none';		//2种模式 定位，鼠标单击为初始位置，目标则单击为goal，双击为设定目标
            
            // current robot pose message
            nav2D.robotPose = null;
            // current goal
            nav2D.goalMessage = null;

            // icon information for displaying robot and click positions
            var clickRadius = 1;
            var clickUpdate = true;
            var maxClickRadius = 5;
            var robotRadius = 1;
            var robotRadiusGrow = true;
            var maxRobotRadius = 10;

            // position information
            var robotX;
            var robotY;
            var robotRotZ;
            var clickX;
            var clickY;

            // map and metadata
            var map;
            var mapWidth;
            var mapHeight;
            var mapResolution;
            var mapX;
            var mapY;
            var drawInterval;

            // flag to see if everything (map image, metadata, and robot pose) is available
            var available = false;

            // grab the canvas
            var canvas = document.getElementById(nav2D.canvasID);		//canvas由html定义

            // check if we need to fetch a map or if an image was provided
            if (nav2D.image) {
              // set the image
              map = new Image();
              map.src = nav2D.image;

              // get the meta information
              var metaListener = new nav2D.ros.Topic({
                name : nav2D.mapMetaTopic,
                messageType : 'nav_msgs/MapMetaData'
              });
              metaListener.subscribe(function(metadata) {
                // set the metadata
                mapWidth = metadata.width;
                mapHeight = metadata.height;
                mapResolution = metadata.resolution;
                mapX = metadata.origin.position.x;
                mapY = metadata.origin.position.y;

                // we only need the metadata once
                metaListener.unsubscribe();
              });
            } else {
              // create a map object
              var mapFetcher = new Map({		//由/map获得地图信息，Map函数在map.js中定义
                ros : nav2D.ros,
                mapTopic : nav2D.mapTopic,
                continuous : nav2D.continuous
              });
              mapFetcher.on('available', function() {
                // store the image
                map = mapFetcher.image;
                // set the metadata
                mapWidth = mapFetcher.info.width;
                mapHeight = mapFetcher.info.height;
                mapResolution = mapFetcher.info.resolution;
                mapX = mapFetcher.info.origin.position.x;			//地图起点由yaml中确定
                mapY = mapFetcher.info.origin.position.y;			//此处已经获得地图

		nav2D.Initdraw();		//只调用一次，显示地图，机器人和地图关系等待定位完成确定
              });
            }

            // setup a listener for the robot pose
            var poseListener = new nav2D.ros.Topic({		//此处需要订阅robot_pose_publisher发布的pose
              name : '/robot_pose',				
              messageType : 'geometry_msgs/Pose',		
              throttle_rate : 100,				
            });
            poseListener.subscribe(function(pose) {
                  // set the public field
                  nav2D.robotPose = pose;
                  
                  // only update once we know the map metadata
                  if (mapWidth && mapHeight && mapResolution) {
                    // get the current canvas size
                    var canvasWidth = canvas.getAttribute('width');
                    var canvasHeight = canvas.getAttribute('height');

                    // set the pixel location with (0, 0) at the top left
                    robotX = ((pose.position.x - mapX) / mapResolution)
                        * (canvasWidth / mapWidth);
                    robotY = canvasHeight
                        - (((pose.position.y - mapY) / mapResolution) * (canvasHeight / mapHeight));

                    // get the rotation Z
                    var q0 = pose.orientation.w;
                    var q1 = pose.orientation.x;
                    var q2 = pose.orientation.y;
                    var q3 = pose.orientation.z;
                    
                    robotRotZ = -Math.atan2(2 * ( q0 * q3 + q1 * q2) , 1 - 2 * (Math.pow(q2,2) +Math.pow(q3,2)));

                    // check if this is the first time we have all information
                    if (!available) {
                      available = true;
                      // notify the user we are available
                      nav2D.emit('available');
                      // set the interval for the draw function
                      drawInterval = setInterval(draw, 30);
                    }
                  }
                });

            // setup the actionlib client
            var actionClient = new ActionClient({
              ros : nav2D.ros,
              actionName : nav2D.actionName,
              serverName : nav2D.serverName,
              timeout : nav2D.serverTimeout
            });
            // pass the event up
            actionClient.on('timeout', function() {
              nav2D.emit('timeout');
            });

            // create a cancel
            nav2D.cancel = function() {
              actionClient.cancel();
            };

            nav2D.drawrobot = nav2D.drawrobot || function(context,robotX,robotY) {
              context.fillStyle = nav2D.robotColor;		//指定颜色
              context.beginPath();		//清空子路径	
              context.arc(robotX, robotY, robotRadius, 0, Math.PI * 2, true);	//圆弧
              context.closePath();	//闭合路径
              context.fill();		//颜色填充路径

              // grow and shrink the icon
              if (robotRadiusGrow) {		//扩大或缩小图标
                robotRadius++;
              } else {
                robotRadius--;
              }
              if (robotRadius == maxRobotRadius || robotRadius == 1) {
                robotRadiusGrow = !robotRadiusGrow;
              }
            };

            // create the draw function
            var draw = function() {
              // grab the drawing context
              var context = canvas.getContext('2d');

              // grab the current sizes
              var width = canvas.getAttribute('width');
              var height = canvas.getAttribute('height');

              // add the image back to the canvas
              context.drawImage(map, 0, 0, width, height);	//参数 图片，画布左上，左下，图片宽，长

              // check if the user clicked yet
              if (clickX && clickY && nav2D.mode == 'none') {
                // draw the click point
                context.fillStyle = nav2D.clickColor;
                context.beginPath();
                context.arc(clickX, clickY, clickRadius, 0, Math.PI * 2,true);
                context.closePath();
                context.fill();

                // grow half the speed of the refresh rate
                if (clickUpdate) {
                  clickRadius++;
                }

                // reset at the threshold (i.e., blink)
                if (clickRadius == maxClickRadius) {
                  clickRadius = 1;
                }

                clickUpdate = !clickUpdate;
              }

              // draw the robot location
              nav2D.drawrobot(context,robotX,robotY,robotRotZ);
            };

	    nav2D.Initdraw = function() {	//初始画图，无需定位，机器人设定处于（0，0）
		var Initcontext = canvas.getContext('2d');
                var Initwidth = canvas.getAttribute('width');
                var Initheight = canvas.getAttribute('height');
		Initcontext.drawImage(map, 0, 0, Initwidth, Initheight);//参数 图片，画布左上，左下，图片宽，长
		nav2D.drawrobot(Initcontext,0,0,0);
		};

            // get the position in the world from a point clicked by the user
            nav2D.getPoseFromEvent = function(event) {
              // only go if we have the map data
              if (available) {
                // get the y location with (0, 0) at the top left
                var offsetLeft = 0;
                var offsetTop = 0;
                var element = canvas;
                while (element && !isNaN(element.offsetLeft)	//isNaN是否有非数值
                    && !isNaN(element.offsetTop)) {
                  offsetLeft += element.offsetLeft - element.scrollLeft;	//去除滚动条
                  offsetTop += element.offsetTop - element.scrollTop;
                  element = element.offsetParent;	//取根元素
                }
                clickX = event.pageX - offsetLeft;	//pageX为相对于页面左上角的位置，不随滚动条变化,
							//clickX相对于canvas左边界的距离
                clickY = event.pageY - offsetTop;	

                // convert the pixel location to a pose
                var canvasWidth = canvas.getAttribute('width');
                var canvasHeight = canvas.getAttribute('height');
                var x = (clickX * (mapWidth / canvasWidth) * mapResolution)	//mapWidth为原图片宽度
                    + mapX;		//mapX为地图起点坐标			//canvas显示图片时变化了图片
                var y = ((canvasHeight - clickY) * (mapHeight / canvasHeight) * mapResolution)
                    + mapY;
                return [ x, y ];
              } else {
                return null;
              }
            };

            // a function to send the robot to the given goal location
            nav2D.sendGoalPose = function(x, y) {		//鼠标双击事件中调用
              // create a goal
              var goal = new actionClient.Goal({
                target_pose : {
                  header : {
                    frame_id : '/map'
                  },
                  pose : {
                    position : {
                      x : x,
                      y : y,
                      z : 0
                    },
                    orientation : {
                      x : 0,
                      y : 0,
                      z : 0.6,
                      w : 0.8
                    }
                  }
                }
              });
              goal.send();
              
              nav2D.goalMessage = goal.goalMessage;

              // pass up the events to the user
              goal.on('result', function(result) {
                nav2D.emit('result', result);
                nav2D.mode = 'none';

                // clear the click icon
                clickX = null;
                clickY = null;
              });
              goal.on('status', function(status) {
                nav2D.emit('status', status);
              });
              goal.on('feedback', function(feedback) {
                nav2D.emit('feedback', feedback);
              });
            };


           canvas.addEventListener('click',function(event) {		//此函数不同浏览器参数不同
	     nav2D.mode = 'init';	//设定单击为设定起始位置
             if(nav2D.mode == 'none') {           }	//设定模式选择菜单
             else if(nav2D.mode == 'init') 
             {             
		var poses = nav2D.getPoseFromEvent(event);	//获得鼠标在地图中的位置
               if (poses != null) {
                 nav2D.sendInitPose(poses[0], poses[1]);
               } else {
                 nav2D.emit('error',"All of the necessary navigation information is not yet available."); 
               }
             }
             else if(nav2D.mode == 'goal') {
               var poses = nav2D.getPoseFromEvent(event);
               if (poses != null) {
                 nav2D.sendGoalPose(poses[0], poses[1]);
               } else {
                 nav2D.emit('error',"All of the necessary navigation information is not yet available.");
               }
             }
             else {
               nav2D.emit('error',"Wrong mode..");
             }
             nav2D.mode = 'none';
            });		//此处可能3个参数 false

            nav2D.setmode = function(mode) {
              nav2D.mode = mode;
              clickX = null;
              clickY = null;
            };

	 /*  var InitposeListener = new nav2D.ros.Topic({		//此处需要订阅amcl发布的pose
		 		name : '/amcl_pose',
              			messageType : 'geometry_msgs/PoseWithCovarianceStamped',
              			throttle_rate : 100,
            		});
	  InitposeListener.subscribe(function(initpose) {	//获得定位后的位置和方向改变canvas上初始位置


	  });*/
          nav2D.initPosePub = new nav2D.ros.Topic({
              name : nav2D.initialPoseTopic,		//amcl订阅
              type : 'geometry_msgs/PoseWithCovarianceStamped',
            });

            nav2D.sendInitPose = function(x,y) {
              var pose_msg = new ros.Message({
                header : {
                    frame_id : '/map'
                },
                pose : {
                  pose : {
                    position: {
                      x : x,
                      y : y,
                      z : 0,
                    },
                    orientation : {
                      x : 0,
                      y : 0,
                      z : 0,
                      w : 1,
                    },
                  },
                  covariance: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
                },
              });
              nav2D.initPosePub.publish(pose_msg);
              nav2D.setmode('none');
            };
            canvas.addEventListener(
                    'dblclick',
                    function(event) {
                      var poses = nav2D.getPoseFromEvent(event);	//获得双击坐标在地图中的位置
                      if (poses != null) {
                        nav2D.sendGoalPose(poses[0], poses[1]);
                      } else {
                        nav2D.emit('error',
                                "All of the necessary navigation information is not yet available.");
                      }
                    });
          };
          Nav2D.prototype.__proto__ = EventEmitter2.prototype;
          return Nav2D;
        }));
