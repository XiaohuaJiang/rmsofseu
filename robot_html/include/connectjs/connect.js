function connect_button_onclick()	//连接按钮响应事件
{				
	if(document.connect_form.texturl.value == "")
	{
		alert("\nPlease input the URL!");
		document.connect_form.texturl.focus();
	}
	else
	{						
		if(document.connect_form.connect_button.value == "Connect")		//若未连接
		{		
			ros = new ROSLIB.Ros();
			ros.on('error', function(error) 
			{
				console.log(error);
			});
			ros.connect("ws://" + document.connect_form.texturl.value);		//连接rosbridge_server，默认端口9091
			ros.on('connection',function() 
			{
				document.connect_form.connect_button.value = "Disconnect";
				document.connect_form.texturl.disabled = true;		//禁止输入
				component_init();	//组件初始化
			});
		}
		else		//已经连接,点击则断开链接
		{
			document.connect_form.connect_button.value = "Connect";
			ros.close();		//断开链接
			document.connect_form.texturl.disabled = false;		//需要停止所有节点
		}
	}
}

