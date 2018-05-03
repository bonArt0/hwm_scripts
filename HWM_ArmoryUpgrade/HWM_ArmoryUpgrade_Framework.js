    // Constructor
	function Framework(config) {
		this.SetConfig(config);
		this.settings = new Settings();
		this.modules = [];
		foreach (var module in this.config['modules'])
    };
	
	Framework.prototype.SetConfig = function(config) {
		var configArr = decode_json(config);
		for (var prop in configArr) {
			framework.config[prop] = prop;
		}
	}
	
    Framework.prototype.Assemble = function() {
		this.AssembleSettings();
		this.AssembleModules();
    };
	
	Framework.prototype.AssembleSettings = function() {
		var stnButton = $('<input>').addClassCss.addClassJs;
		var stnBlock = $('<div>').addClassCss.addClassJs;
		stnBlock.append(blockTemplate.append(modOptions));
		
		$(domElement).append(stnButton);
		$(domElement).append(stnBlock);
	}
	
	Framework.prototype.AssembleModules = function() {// TODO: out of here
		for (var module in this.config.modules) {
			this.modules[module.name] = new Module(module.name);
			this.modules[module.name].Assemble();
		}
	}
