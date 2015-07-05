/**
 * @author Russell Toris - rctoris@wpi.edu
 * @author Lars Kunze - l.kunze@cs.bham.ac.uk
 */

var NAV2D = NAV2D || {
  REVISION : '2'
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 * @author Lars Kunze - l.kunze@cs.bham.ac.uk
 */

/**
 * A navigator can be used to add click-to-navigate options to an object. If
 * withOrientation is set to true, the user can also specify the orientation of
 * the robot by clicking at the goal position and pointing into the desired
 * direction (while holding the button pressed).
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 */
NAV2D.Navigator = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var serverName = options.serverName || '/move_base';
  var actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
  var withOrientation = options.withOrientation || false;
  //var withOrientation = options.withOrientation ||true;
  this.rootObject = options.rootObject || new createjs.Container();

  // setup the actionlib client
  var actionClient = new ROSLIB.ActionClient({
    ros : ros,
    actionName : actionName,
    serverName : serverName
  });
 function ale() {
    	alert("mouse down!");
  	}
 function firm(x, y) {
	if(confirm("Are you sure? x="+x+",y=",y)){
		alert("clicked OK!");
	}
	else {
		alert("clicked delete!");
	}
}
  /**
   * Send a goal to the navigation stack with the given pose.
   *
   * @param pose - the goal pose
   */
  function sendGoal(pose) {
    // create a goal
    var goal = new ROSLIB.Goal({
      actionClient : actionClient,
      goalMessage : {
        target_pose : {
          header : {
            frame_id : '/map'
          },
          pose : pose
        }
      }
    });
    //firm(goal.pose.position.x,goal.pose.position.y.goal);
    goal.send();
    
    // create a marker for the goal
    /*var goalMarker = new ROS2D.NavigationArrow({
      size : 8,
      strokeSize : 1,
      fillColor : createjs.Graphics.getRGB(255, 64, 128, 0.66),
      pulse : true
    });
    goalMarker.x = pose.position.x;
    goalMarker.y = -pose.position.y;
    goalMarker.rotation = stage.rosQuaternionToGlobalTheta(pose.orientation);
    goalMarker.scaleX = 1.0 / stage.scaleX;
    goalMarker.scaleY = 1.0 / stage.scaleY;
    that.rootObject.addChild(goalMarker);
    goal.on('result', function() {					   
      that.rootObject.removeChild(goalMarker);
    });*/
    //goalMarker.visible=true; //add by jxh on 2014.11.14
  }
  
  // get a handle to the stage
  var stage;
  if (that.rootObject instanceof createjs.Stage) {
    //alert("Hello3");
    stage = that.rootObject;
  } 
  else {
	//alert("Hello2");
    stage = that.rootObject.getStage();
  }

  // marker for the robot
  var robotMarker = new ROS2D.NavigationArrow({
 //var robotMarker = new ROS2D.DisplayPlan({
    size : 12,
    strokeSize : 1,
    fillColor : createjs.Graphics.getRGB(255, 128, 0, 0.66),
    pulse : true
  });
  // wait for a pose to come in first
  robotMarker.visible = false;
  this.rootObject.addChild(robotMarker);
  var initScaleSet = false;
   

  // setup a listener for the robot pose
  var poseListener = new ROSLIB.Topic({
    ros : ros,
    name : '/robot_pose',
    messageType : 'geometry_msgs/Pose',
    throttle_rate : 100
   
  });
  
  poseListener.subscribe(function(pose) {
    // update the robots position on the map
    robotMarker.x = pose.position.x;
    robotMarker.y = -pose.position.y;
    if (!initScaleSet) {
      robotMarker.scaleX = 1.0 / stage.scaleX;
      robotMarker.scaleY = 1.0 / stage.scaleY;
      initScaleSet = true;
    }

    // change the angle
    robotMarker.rotation = stage.rosQuaternionToGlobalTheta(pose.orientation);

    robotMarker.visible = true;

  

  });

/*listen the remote goal*/
  var robotgoalMarker = new ROS2D.NavigationArrow({
 //var robotMarker = new ROS2D.DisplayPlan({
    size : 12,
    strokeSize : 1,
    fillColor : createjs.Graphics.getRGB(128, 128, 0, 0.66),
    pulse : true
  });
    // update the robots position on the map
    robotgoalMarker.visible = false;
    this.rootObject.addChild(robotgoalMarker);
    var initgoalScaleSet = false;
  // wait for a pose to come in first
  
   
  // setup a listener for the robot pose
  var posegoalListener = new ROSLIB.Topic({
    ros : ros,
    name : '/goal',
    messageType : 'geometry_msgs/PoseStamped',
    throttle_rate : 100
   
  });
  
    posegoalListener.subscribe(function(robotgoal) {
    //alert("hhhh!");
    robotgoalMarker.x = robotgoal.pose.position.x;
    robotgoalMarker.y = -robotgoal.pose.position.y;
    //alert("hhhh!");
    if (!initgoalScaleSet) {
      robotgoalMarker.scaleX = 1.0 / stage.scaleX;
      robotgoalMarker.scaleY = 1.0 / stage.scaleY;
      initgoalScaleSet = true;
	//alert("hhhh!");
    }

    // change the angle
    robotgoalMarker.rotation = stage.rosQuaternionToGlobalTheta(robotgoal.pose.orientation);

    robotgoalMarker.visible = true;
    

  });
  
  var planListener = new ROSLIB.Topic({
    ros : ros,
    name : '/Navigator/plan',
    messageType : 'nav_msgs/GridCells',
    throttle_rate : 100
   
  });
    var planMarker;
  
    planListener.subscribe(function(navplan) {
    that.rootObject.removeChild(planMarker);
    planMarker = new ROS2D.DisplayPlan({
    size : 486,
    strokeSize : 1,
    pulse : true,
    plan: navplan
    });
    //firm(this.width,this.height);
    planMarker.visible = false;
    that.rootObject.addChild(planMarker);
    var initplanScaleSet = false;
   
	
    var len=navplan.cells.length;
    planMarker.x = navplan.cells[0].x;
    planMarker.y = -navplan.cells[0].y;
    if (!initplanScaleSet) {
      	planMarker.scaleX = 1.0 / stage.scaleX;
      	planMarker.scaleY = 1.0 / stage.scaleY;
      	initplanScaleSet = true;
	
    }
	planMarker.rotation = stage.rosQuaternionToGlobalTheta(navplan.cells[0].z);
   	planMarker.visible = true;
});
   
 
 
  if (withOrientation === false){//edit by jxh on 2014.11.14
    // setup a double click listener (no orientation)
    this.rootObject.addEventListener('dblclick', function(event) {
	//this.rootObject.addEventListener('stagemouseup', function(event) {
      // convert to ROS coordinates
	//alert("Hello");
      var coords = stage.globalToRos(event.stageX, event.stageY);
      var pose = new ROSLIB.Pose({
        position : new ROSLIB.Vector3(coords)
      });
	
      // send the goal
      sendGoal(pose);
    });
  } 
  else { // withOrientation === true
    // setup a click-and-point listener (with orientation)
    var position = null;
    var positionVec3 = null;
    var thetaRadians = 0;
    var thetaDegrees = 0;
    var orientationMarker = null;
    var mouseDown = false;
    var xDelta = 0;
    var yDelta = 0;
    var mouseEventHandler = function(event, mouseState) {
	//position = stage.globalToRos(event.stageX, event.stageY);
        //positionVec3 = new ROSLIB.Vector3(position);
        //mouseDown = true;
      if (mouseState === 'down'){
        // get position when mouse button is pressed down
	//firm();
	//alert(mouseState);
        position = stage.globalToRos(event.stageX, event.stageY);
        positionVec3 = new ROSLIB.Vector3(position);
        mouseDown = true;
      }
      else if (mouseState === 'move'){
        // remove obsolete orientation marker
        that.rootObject.removeChild(orientationMarker);
        //alert(mouseState);
        if ( mouseDown === true) {
          // if mouse button is held down:
          // - get current mouse position
          // - calulate direction between stored <position> and current position
          // - place orientation marker
          var currentPos = stage.globalToRos(event.stageX, event.stageY);
          var currentPosVec3 = new ROSLIB.Vector3(currentPos);

          orientationMarker = new ROS2D.NavigationArrow({
            size : 30,
            strokeSize : 1,
            fillColor : createjs.Graphics.getRGB(0, 255, 0, 0.66),
            pulse : false
          });
	  //alert("mouseState1");
	 //alert(positionVec3.x);
          xDelta =  currentPosVec3.x - positionVec3.x;
          yDelta =  currentPosVec3.y - positionVec3.y;
	  //alert(xDelta);
          //firm(xDelta,yDelta);
          thetaRadians  = Math.atan2(xDelta,yDelta) + Math.PI/2;

          thetaDegrees = thetaRadians * (180.0 / Math.PI);
          
          if (thetaDegrees >= 0 && thetaDegrees <= 180) {
            thetaDegrees += 270;
          } else {
            thetaDegrees -= 90;
          }
	  //alert("mouseState2");
          orientationMarker.x =  positionVec3.x;
          orientationMarker.y = -positionVec3.y;
          orientationMarker.rotation = thetaDegrees;
          orientationMarker.scaleX = 1.0 / stage.scaleX;
          orientationMarker.scaleY = 1.0 / stage.scaleY;
         // alert("mouseState3");
          that.rootObject.addChild(orientationMarker);
        }
      } else if(mouseState === 'up'){ // mouseState === 'up'
        // if mouse button is released
        // - get current mouse position (goalPos)
        // - calulate direction between stored <position> and goal position
        // - set pose with orientation
        // - send goal
        mouseDown = false;
	//alert(mouseState);
        var goalPos = stage.globalToRos(event.stageX, event.stageY);
	//firm(xDelta,yDelta);
        var goalPosVec3 = new ROSLIB.Vector3(goalPos);
        //alert(goalPosVec3.x+","+ goalPosVec3.y);
        xDelta =  goalPosVec3.x - positionVec3.x;
        yDelta =  goalPosVec3.y - positionVec3.y;
        thetaRadians  = Math.atan2(xDelta,yDelta);
        //firm(xDelta,yDelta);
        if (thetaRadians >= 0 && thetaRadians <= Math.PI) {
          thetaRadians += (3 * Math.PI / 2);
        } else {
          thetaRadians -= (Math.PI/2);
        }
        
        var qz =  Math.sin(-thetaRadians/2.0);
        var qw =  Math.cos(-thetaRadians/2.0);
        
        var orientation = new ROSLIB.Quaternion({x:0, y:0, z:qz, w:qw});
        
        var pose = new ROSLIB.Pose({
          position :    positionVec3,
          orientation : orientation
        });
	//alert("hello2!")
        // send the goal
        sendGoal(pose);
      }
	
    };

    this.rootObject.addEventListener('stagemousedown', function(event) {
      mouseEventHandler(event,'down');
    });
    this.rootObject.addEventListener('dblclick', function(event) {
      mouseEventHandler(event,'dblclick');
    });
    this.rootObject.addEventListener('stagemousemove', function(event) {
      mouseEventHandler(event,'move');
    });

    this.rootObject.addEventListener('stagemouseup', function(event) {
      mouseEventHandler(event,'up');
    });
  }
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A OccupancyGridClientNav uses an OccupancyGridClient to create a map for use with a Navigator.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 *   * continuous (optional) - if the map should be continuously loaded (e.g., for SLAM)
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 *   * viewer - the main viewer to render to
 */
NAV2D.OccupancyGridClientNav = function(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  var topic = options.topic || '/map';
  var continuous = options.continuous;
  this.serverName = options.serverName || '/move_base';
  this.actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
  this.rootObject = options.rootObject || new createjs.Container();
  this.viewer = options.viewer;
  this.withOrientation = options.withOrientation || false;
 // this.withOrientation = options.withOrientation || true;

  this.navigator = null;

  // setup a client to get the map
  var client = new ROS2D.OccupancyGridClient({
    ros : this.ros,
    rootObject : this.rootObject,
    continuous : continuous,
    topic : topic
  });
  client.on('change', function() {
    that.navigator = new NAV2D.Navigator({
      ros : that.ros,
      serverName : that.serverName,
      actionName : that.actionName,
      rootObject : that.rootObject,
      withOrientation : that.withOrientation
    });
    
    // scale the viewer to fit the map
    //that.viewer.shift(client.currentGrid.pose.position.x, client.currentGrid.pose.position.y);
    that.viewer.scaleToDimensions(client.currentGrid.width, client.currentGrid.height);
    //that.viewer.shift(client.currentGrid.x,client.currentGrid.y);
  });
};
