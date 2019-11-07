# MERGEJS

  Simple command line shell script to merge and compress your javascript files in a single file. It uses the [Closure compiler of Google](http://closure-compiler.appspot.com/) to compress the javascript.

## Pitch 
  When you develop in javascript, it's more convenient to write your code in several files to keep things clean and modular. Yet when you release your app to production, it's better to merge and minify those files together in a single file to reduce the http requests and optimize your page load time. This script allows you to do just that in a very simple way. It's perfect for a simple website.
  
  Here's how it works :
  
  Input = text file that lists the js files you want to merge : `input.txt`<br/>
  Output = the merged file containing the content of the listed files : `output.js`
  
  Command :
	
    $ mergejs input.txt output.js	 

## Features

* List the js files to merge in order in a simple text file
* Comment out a file that should not be merged, yet you want to keep it in the list text file
* Specify the name of the merged file
* [option] Minify the resulting merged file
* [option] Specify the name of the minified file
* Several merging conf files will result in several merged files

## Installation

1.  [download](https://github.com/eloone/mergejs/archive/master.zip) the script.
2.  put the `mergejs` file downloaded in a directory included in your $PATH, for example in `/usr/local/bin`
3. typing `mergejs` in your terminal should print out the help with the commands to run

## Default usage

1. in your js folder containing the js files you want to merge create a simple text file named as you wish, for example `js_files_list.txt`. Your js directory could look like this :

		js/                --> your js files
			file1.js
      		file2.js
      		file3.js
      		js_files_list.txt
            
2. in `js_files_list.txt` list the names of the js files you want to merge, one per line, in the order you want to merge them. Your `js_files_list.txt` could look like this :

		file1.js
		file3.js
		file2.js
        
3. in your terminal, `cd` to the js folder and run this command :

		$ mergejs js_files_list.txt merged_files.js

    Now the js files you listed in `js_files_list.txt` are merged in the order you specified into `merged_files.js`

4. The output file `merged_files.js` would look like this :

		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		/* Merging js from "js_files_list.txt" begins */
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		/* Last merge : Fri Feb 22 11:25:37 CET 2013  */

		/* Merging order :

		- file1.js
		- file3.js
		- file2.js
		*/

		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		/* Merging js: file1.js begins */
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		//code in file1.js
        
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */   
		/* Merging js: file3.js begins */
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		//code in file3.js
        
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		/* Merging js: file2.js begins */
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		//code in file2.js

## Usage examples

Merge and <b>compress</b> the js files specified in `js_files_list.txt` into `merged_files.js` :
	
    $ mergejs -c js_files_list.txt merged_files.js
    
This will merge the js files into `merged_files.js` and then minify `merged_files.js` into `merged_files-min.js`

---

Merge the js files specified in `js_files_list.txt` into `merged_files.js` and compress `merged_files.js` into `my_compressed_file.js`

	$ mergejs -c js_files_list.txt merged_files.js my_compressed_file.js
<br/>

---

Comment a file that should not be merged in `js_files_list.txt` :

	file1.js
    #file2.js --> this file will not be merged 
	file3.js
  <br/>  
  
---

If you specify the paths to the files in your list text file, you don't need to be in the js folder when you run the command. You can chose how you would like to use the script depending on your needs, the script only needs to find the files you specify in your list.

## Notes

This script was specifically designed for js files, but you can easily tweak it to merge other types of files. It's the equivalent to copy pasting the content of files into a merged file. So you can fork it and tweak it for your needs to merge all kinds of files.

This script is not destined to evolve into a package manager. Its purpose is really just to merge files. However it could be integrated into a package manager as just a component.

The settings for the compression done by Google's compiler are set to `Simple`. In you need other settings, you can easily change it in the script itself.
    
