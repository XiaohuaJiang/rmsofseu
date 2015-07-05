function component_create(name,room,pos,srv)
{
	var list = document.getElementById("node_list");	//获得node_list元素
	var tmp_header = document.createElement("h3");
	tmp_header.textContent = name;
	list.appendChild(tmp_header);
	var tmp_div = document.createElement("div");
	tmp_div.style.fontSize = "8pt";			//设定content字体
	var tmp_room = document.createElement("p");
	tmp_room.textContent = "Room : " + room;
	tmp_div.appendChild(tmp_room);
	var tmp_pos = document.createElement("p");
	if(pos.type == "auto")
	{
		tmp_pos.textContent = "Position Type : Auto";	//需启动自定位
	}
	else
		tmp_pos.textContent = "Position Type : Manual\n" + " x : " + pos.x + " y : "  + pos.y;
	tmp_div.appendChild(tmp_pos);
	var tmp_srv = document.createElement("div");	//服务模块
	tmp_srv.textContent = "Service :\n";
	var tmp_ul = document.createElement("ul");
	srv.forEach(function(srvMessage){
		var tmp_li = document.createElement("li");	//服务条目
		var tmp_a = document.createElement("a");
		tmp_a.href = "#";
		tmp_a.textContent = srvMessage.name;
		tmp_a.onclick = function(){
		var tmp_detail_dialog = document.getElementById("srv_detail");
		tmp_detail_dialog.textContent = "";		//需要清空
		var tmp_detail_name = document.createElement("p");
		tmp_detail_name.textContent = "Name : " + srvMessage.name;
		tmp_detail_dialog.appendChild(tmp_detail_name);
		var tmp_detail_type = document.createElement("p");
		tmp_detail_type.textContent = "Type : " + srvMessage.type;
		tmp_detail_dialog.appendChild(tmp_detail_type);
		if(srvMessage.input_parameter != "")
		{
			var tmp_detail_inputparameter = document.createElement("p");
			tmp_detail_inputparameter.textContent = "Input Parameter : " + srvMessage.input_parameter;
			tmp_detail_dialog.appendChild(tmp_detail_inputparameter);
			var tmp_detail_inputtype = document.createElement("p");
			tmp_detail_inputtype.textContent = "Input Type : " + srvMessage.input_type;
			tmp_detail_dialog.appendChild(tmp_detail_inputtype);
			var tmp_detail_inputdescription= document.createElement("p");
			tmp_detail_inputdescription.textContent = "Input Description :\n" + srvMessage.input_description;
			tmp_detail_dialog.appendChild(tmp_detail_inputdescription);
		}
		if(srvMessage.output_parameter != "")
		{
			var tmp_detail_outputparameter = document.createElement("p");
			tmp_detail_outputparameter.textContent = "Outputput Parameter : " + srvMessage.output_parameter;
			tmp_detail_dialog.appendChild(tmp_detail_outputparameter);
			var tmp_detail_outputtype = document.createElement("p");
			tmp_detail_outputtype.textContent = "Output Type : " + srvMessage.output_type;
			tmp_detail_dialog.appendChild(tmp_detail_outputtype);
			var tmp_detail_outputdescription= document.createElement("p");
			tmp_detail_outputdescription.textContent = "Output Description :\n" + srvMessage.output_description;
			tmp_detail_dialog.appendChild(tmp_detail_outputdescription);
		}
		$("#srv_detail").dialog("open");
	}
	tmp_li.appendChild(tmp_a);
	tmp_ul.appendChild(tmp_li);
	});
	tmp_srv.appendChild(tmp_ul);
	tmp_div.appendChild(tmp_srv);
	/**************添加详细信息按钮******************/
	tmp_p = document.createElement("p");
	tmp_more = document.createElement("a");
	tmp_more.href = "#";
	tmp_more.textContent = "More";
	tmp_more.className = "ui-state-default ui-corner-all";
	tmp_more.onclick = function(){
		var tmp_dialog = document.getElementById("srv_detail");
		tmp_dialog.textContent = "";		//需要清空
		var tmp_dialog_ul = document.createElement("ul");	//创建srv条目
		srv.forEach(function(srvMessage){
			var tmp_dialog_li = document.createElement("li");
			tmp_dialog_li.textContent = srvMessage.name;
			tmp_dialog_ul.appendChild(tmp_dialog_li);
		});
		tmp_dialog.appendChild(tmp_dialog_ul);
		$("#srv_detail").dialog("open");
	}
	tmp_span = document.createElement("span");
	tmp_span.className = "ui-icon ui-icon-newwin";
	tmp_more.style.padding = ".4em 1em .4em 20px";
	tmp_more.style.textDecoration = "none";
	tmp_more.style.position = "relative";
	tmp_span.style.margin = "0 5px 0 0";
	tmp_span.style.position = "absolute";
	tmp_span.style.left = ".2em";
	tmp_span.style.top = "50%";
	tmp_span.style.marginTop = "-8px";
	tmp_more.appendChild(tmp_span);
	tmp_p.appendChild(tmp_more);
	tmp_p.style.marginLeft = "70%";
	tmp_div.appendChild(tmp_p);
	/***********************************************/
	list.appendChild(tmp_div);
}

function accordion_update()		//更新状态栏
{
	$("#node_list").accordion("refresh");
}

function component_init()
{
	node_listener = new ROSLIB.Topic({
		ros : ros,
		name : '/component/info',
		messageType : 'component_server/componentArray'
		});
	node_listener.subscribe(function(statusMessage){	//更新构件状态栏
		statusMessage.com.forEach(function(status){
			component_create(status.name,status.room,status.pos,status.srv);
		});
	accordion_update();
	node_listener.unsubscribe();
	});
}

function component_update()		//清空状态栏后更新构件状态栏
{
	var list = document.getElementById("node_list");
	list.textContent = "";	
	node_listener.subscribe();	//重新订阅当前节点信息
}

function component_widget_add(stage,type,pos_x,pos_y,angle)	//增加图标函数，参数分别为图层、类别、坐标x，坐标y，角度
{
  var img;
  if(type == "Execute Agency")		//执行构件
  {
  }
  else if(type == "Perception")		//感知构件
  {
	  img = new ROS2D.DisplayRectangle({
      size : 10,
      strokeSize : 1,
      fillColor : createjs.Graphics.getRGB(24, 226, 229, 0.66),
    });
  }
  else if(type == "")			//存储构件
  {
  }
  else							//决策构件
  {
  }
  img.x = pos_x;
  img.y = pos_y;
  img.scaleX = 1.0 / stage.scaleX;
  img.scaleY = 1.0 / stage.scaleY;
  img.rotation = angle;  		//偏移角度
  stage.addChild(img);
  stage.enableMouseOver(10);
  img.addEventListener("mouseover",function handleWidgetEvent(event){
					var tmp_dialog = document.getElementById("camera_detail");
					tmp_dialog.textContent = "";		//需要清空
					var mjpeg_viewer = new MJPEGCANVAS.Viewer({
      						divID : 'camera_detail',
      						host : '223.3.13.53',
      						width : 240,
      						height : 200,
      						topic : '/usb_cam_node/image_raw'
    					});
					$("#camera_detail").dialog("open");
			});
  /*img.addEventListener("mouseout",function handleWidgetEvent(event){
					var tmp_dialog = document.getElementById("camera_detail");
					tmp_dialog.textContent = "";		//需要清空
					$("#camera_detail").dialog("close");

			});*/
}

function component_widget_init()	//地图中的构件显示
{
}

function component_widget_update()	//地图中的构件更新
{
}
