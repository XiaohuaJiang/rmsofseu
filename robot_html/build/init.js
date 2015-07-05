function map_init()	//构建地图初始化
{
	map_viewer = new ROS2D.Viewer({
		divID : 'map',
		width : 450,
		height : 486
		});
	var gridClient = new ROS2D.OccupancyGridClient({
      		ros : ros,
      		rootObject : map_viewer.scene
    	});
	gridClient.on('change', function(){
      		map_viewer.scaleToDimensions(gridClient.currentGrid.width,gridClient.currentGrid.height);
    	});
}
function nav2d_init()	//2D导航初始化
{
	map_viewer = new ROS2D.Viewer({
		divID : 'map',
		width : 450,
		height : 486
		});
	var nav = NAV2D.OccupancyGridClientNav({
        ros : ros,
        rootObject : map_viewer.scene,
        viewer : map_viewer
    });
}
function nav3d_init()	//3D导航初始化
{
	var nav3d_viewer = new ROS3D.Viewer({
		divID : 'map',
		width : 450,
		height : 486,
		antialias : true
	});
	nav3d_viewer.addObject(new ROS3D.Grid());
	var nav3d_gridClient = new ROS3D.OccupancyGridClient({
        ros : ros,
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
			component_widget_add(map_viewer.scene,"Perception",9.5,-10.5,90);
			component_widget_add(map_viewer.scene,"Perception",9.5,-6.5,90);
			component_widget_add(map_viewer.scene,"Perception",9.5,-2.5,90);
			component_widget_add(map_viewer.scene,"Perception",7.5,-1.0,180);
			component_widget_add(map_viewer.scene,"Perception",3.5,-1.0,220);
			component_widget_add(map_viewer.scene,"Perception",3.5,-6.0,270);
			component_widget_add(map_viewer.scene,"Perception",4.5,-12.5,310);
			break;
		case 3:
			nav3d_init();
			break;
		default:
			break;
	}
}
