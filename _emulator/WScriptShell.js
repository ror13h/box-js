var controller = require("../_controller")

function WScriptShell() {
	this.environment = x => `(Environment variable ${x})`;
	this.expandenvironmentstrings = function(arg) {
		switch (arg) {
			case "%TEMP%":
				return "(path)";
			case "%TEMP%/":
				return "(path)/";
			default:
				controller.kill(`Unknown argument ${arg}`);
		}
	}
	this.exec = this.run = function() {
		const command = Object.keys(arguments).map(key => arguments[key]).join(" ");
		const filename = controller.getUUID()
		console.log("======================================");
		console.log("    Executing", filename, "in the WScript shell")
		console.log("======================================");
		controller.logSnippet(filename, {as: "WScript code"}, command)
		if (process.argv.indexOf("--no-shell-error") == -1)
			throw new Error("If you can read this, re-run box.js with the --no-shell-error flag.");
	}
}

module.exports = function(name) {
	return new Proxy(new WScriptShell(name), {
		get: function(target, name) {
			name = name.toLowerCase()
			switch (name) {
				default:
					if (!(name in target)) {
						controller.kill(`WScriptShell.${name} not implemented!`)
					}
					return target[name];
			}
		}
	})
}