// go to folder "demo" and make new subdirectory "src"
// copy the major "src" folder into the "src" subdirectory

import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const srcPath = path.join(__dirname, "src");
const demoPath = path.join(__dirname, "demo");

// remove the "src" folder from the "demo" folder
const demoSrcDir = path.join(demoPath, "src");
if (fs.existsSync(demoSrcDir)) {
	fs.rmdirSync(demoSrcDir, { recursive: true });
}
// make new subdirectory "src" in "demo"
fs.mkdirSync(demoSrcDir);

//
function makeCopy(file) {
	const srcFile = path.join(srcPath, file);
	// is directory?
	if (fs.lstatSync(srcFile).isDirectory()) {
		// make new subdirectory
		fs.mkdirSync(path.join(demoSrcDir, file));
		// copy all files
		fs.readdirSync(srcFile).forEach((f) => {
			makeCopy(path.join(file, f));
		});
	} else {
		// copy file
		fs.copyFileSync(path.join(srcPath, file), path.join(demoSrcDir, file));
		// open file copy and change the import path
		const content = fs.readFileSync(path.join(demoSrcDir, file), "utf8");
		const newContent = content
			// remove d3 import paths for demo version (to run directly on client)
			.replace('import * as d3 from "d3"', "")
			// on all lines starting with "import" we need to put an .js at the end of the import path if it is not already there
			.replace(/import\s+(.*?)\s+from\s+["'](.*?)["']/g, (match, p1, p2) => {
				if (p2.endsWith(".js")) {
					return match;
				}
				return `import ${p1} from "${p2}.js"`;
			});
		fs.writeFileSync(path.join(demoSrcDir, file), newContent);
	}
}

// get all files and directories in "src"
const srcFiles = fs.readdirSync(srcPath);
srcFiles.forEach((file) => {
	makeCopy(file);
});
