function setTool(id){
		for(tool in tools_bools){
			tools_bools[tool]=false;
		}
		tools_bools[document.getElementById(id).value] = true;
		console.log(tools_bools)
};