function display(n)	//根据鼠标位置显示div位置
{
	var div = document.getElementById('node_description');
	div.style.visibility = "visible";
}
function disappear()
{
	var div = document.getElementById('node_description');
	div.style.visibility = "hidden";
	div = document.getElementById('service');
	div.style.visibility = "hidden";
}
function AskforRUN(com,pack,b,para)
{			
	var temp_str = document.getElementById('log_area').value;	//记录当前文本
	document.debug_form.debug_button.disabled = true;		
	var timeout = setTimeout(function()
	{
		document.getElementById('log_area').value = temp_str.concat(new String("\n节点: ").concat(b).concat(" 运行失败，请重试"));
		document.debug_form.debug_button.disabled = false;
		clearInterval(timer);
		
	},8000);	//8s运行不成功则提示
	var temp = ".";
	var timer = setInterval(function()
	{
		document.getElementById('log_area').value = temp_str.concat(temp);
		if(temp == ".") temp = "..";
		else if(temp == "..") temp = "...";
		else temp = ".";
	},500); 

	var AskforRUNClient = new ros.Service({
	name		:	'/Process_Handle',
	serviceType	:	'service_management/AskforRUN'
	});
	
	var request = new ros.ServiceRequest({ 
	header		: 	"AskforRUN", 
	command		: 	com,
	package		:	pack,
	bin		:	b,
	parameter	:	para});
		
	AskforRUNClient.callService(request, function(result)
	{
		clearTimeout(timeout);	//有回复则清除计时器
		clearInterval(timer);
		document.debug_form.debug_button.disabled = false;	
		if(result.success)
			document.getElementById('log_area').value = temp_str.concat(new String("\n节点: ").concat(b).concat(" 运行成功"));
		else
		{			
			document.getElementById('log_area').value = temp_str.concat("\n运行失败： ").concat(result.error);	
		}
	});
}
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
			ros = new ROS();
			ros.on('error', function(error) {console.log(error);});
			ros.connect(document.connect_form.texturl.value);		//连接rosbridge_server，默认端口9091
			ros.on('connection',function(connection) 
			{
				document.connect_form.connect_button.value = "Disconnect";
				document.connect_form.texturl.disabled = true;		//禁止输入
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
function connect_debug_onclick()	//连接按钮响应事件
{	
	if(document.debug_form.text_debug.value == "")
	{
		alert("\nPlease input the command!");
		document.debug_form.text_debug.focus();
	}
	else	//解析输入
	{
		var command = document.debug_form.text_debug.value;
		var array = command.split(" ");
		if(array[0] != "rosrun")
		{
			alert("\n命令无法识别!");
			document.debug_form.text_debug.value = "";
			return;
		}
		if(document.getElementById('log_area').value == "")
			document.getElementById('log_area').value = new String("请求运行节点: ").concat(array[2]);
		else
			document.getElementById('log_area').value = document.getElementById('log_area').value.concat(new String("\n请求运行节点: ").concat(array[2]));
		if(array.length > 3)			//存在给定参数
			AskforRUN(array[0],array[1],array[2],array.slice(3).toString());
		else
			AskforRUN(array[0],array[1],array[2],"");
	}
}

