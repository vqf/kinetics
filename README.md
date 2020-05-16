# EKS
Kinetics simulator for virtual enzymology lessons. To use, simply copy all the files to the same folder and open `kinetics.html` in any compatible browser. The video (`Additional_File_1.mp4`) shows an example of the workflow. Briefly, the interface consists of:

-A text box and a button (`Enter`) for mechanisms. A mechanism is made of reactions separated by semicolons. In a reaction, each side contains chemical symbols for reactants or products, possibly preceded by an integer, separated by `+`. Each side is separated by `=` if the reaction is considered reversible and `-` if it is considered irreversible (always to the right side). *Warning: in this version, the correct stoichiometry of the reaction is entirely up to the user.*

-Two buttons to `Simulate` the reaction or `Reset` to the last state prior to the simulation. Pressing `Simulate` again stops the simulation.

-A left panel to change the parameters of the mechanism and follow the concentrations of reactants and products. Each reaction is given two or one kinetic constant. The value of each constant can be changed by clicking on it (i. e., k<sub>1</sub>). *Warning: by default, concentrations are given in &micro;M, second- and higher-order constants must be presented in the corresponding units*. The concentration of each species is given below. For each species shown at the left with a unique color there is a graphical representation with a red rectangle and a number representation. Concentrations can be set by clicking on the rectangle or on the number. 

-A right panel with a graphical representation of each concentration through time. The color of each species is the same as in the left panel. Clicking on the name of the species at the left panel copies a table with the concentration of that species through time to the clipboard.

Coupled reactions can be written together (i. e., `E+S=ES-E+P`) or separately (`E+S=ES; ES-E+P`). The example in the video contains a mechanism for an enzyme `E` acting on a substrate `S` and inhibited competitively by `I` (`E+S=ES-E+P; EI=E+I`). Stoichiometric labels should work, like in `2A=AA`.

This simulator should be considered work in progress. There are some experimental features that may not work well:

-You can write something like `H2SO4` and the formula will show H<sub>2</sub>SO<sub>4</sub>. Thus, the last example of the previous paragraph might also be written as `2A=A2`. 

-Monovalent cations and anions can be written with `.` and `,`, respectively. For instance, you can represent a proton with `H.`. This version has no mechanism to represent multivalent ions.

-Water (`H2O`) is never shown. At the beginning of the reaction, it is given a concentration of 55.5 M.

# Settings for exercises

With this web page as a template, it is relatively easy to create customized pages for exercises if you have some experience with javascript. However, given the inability of `javascript` to write something to disk, this version requires manually editing the file. This procedure can be vastly simplified if users find it important. 

Any plain-text editor, like `Notepad` or `Notepad++` can be used. The idea is to edit the starting javascript code to set the model and its parameters. It is important to know that the `kinetics.js` module uses a global object called `frm`. The relevant functions to manipulate this object are:

-`frm.fromString(jsonText)`, which reads a `JSON` representation of the model (`jsonText`) and enters it.
-`frm.hideFormula()`, which hides the model.
-`frm.hide(species)`, which hides a given reactant or product.

One relatively simple way to create a web page with a custom model would be:

1. Copy `kinetics.html` with another name into the same folder. In this example, it will be `buffer.html`.
1. Set a model you are interested in showing. For instance, let us simulate an acetate buffer with `H2O=H.+OH,;AcH=Ac,+H.`. This will set four kinetic constants: k<sub>1</sub>, k<sub>-1</sub>, k<sub>3</sub> and k<sub>-3</sub>. Set the following values: k<sub>1</sub> = 2e-10; k<sub>-1</sub> = 1; k<sub>3</sub> = 3.16; k<sub>-3</sub> = 0.1; The idea is to have kinetic constants that allow a reasonable simulation while being compatible with K<sub>W</sub> = 10<sup>-14</sup>M<sup>2</sup> and K<sub>a</sub> = 10<sup>-4.5</sup> M (remember that the upper numbers have &micro;M as the basic unit for concentration).
1. Open the development console of the browser. In most browsers, you can do that with `CTRL`+`SHIFT`+`I`. 
1. At the console, type `frm.toString()`. The answer should be `"{"original":"H2O=H.+OH,;AcH=Ac,+H.","k":[{"r":{"id":"k0_p","pos":1,"conc":2e-10,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k0_m","pos":1,"conc":1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}},{"r":{"id":"k1_p","pos":5,"conc":0}},{"r":{"id":"k2_p","pos":7,"conc":3.16,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k2_m","pos":7,"conc":0.1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}}],"species":{"H2O":{"conc":55000000,"show":false},"H_dot_":{"conc":0,"show":true},"OH_com_":{"conc":0,"show":true},"AcH":{"conc":0,"show":true},"Ac_com_":{"conc":0,"show":true}}}"`.
1. Copy this text, it represents the model you just created.
1. Open `buffer.html` in your favorite plain-text editor and locate the initial script:
    
	``` 
	<script>
	  $(document).ready(function(){
		$(".nosend").submit(function(e){ 
			e.preventDefault();
		});
		$("#noscript").hide();
		let model = {"original":"E+S=ES=E+P","k":[{"r":{"id":"k0_p","pos":3,"conc":0.1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"},"l":{"id":"k0_m","pos":3,"conc":0.1,"order":1,"units":"s<span class=\"super\">-1</span>"}},{"r":{"id":"k1_p","pos":5,"conc":0.1,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k1_m","pos":5,"conc":0.1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}}],"species":{"E":{"conc":0,"show":true},"S":{"conc":0,"show":true},"ES":{"conc":0,"show":true},"P":{"conc":0,"show":true}}};
		frm.fromString(JSON.stringify(model));
		setFig1();
		setFig2();
	  });
	</script>
	```
1. Remove the text to the right of `let model = `:

```
	<script>
	  $(document).ready(function(){
		$(".nosend").submit(function(e){ 
			e.preventDefault();
		});
		$("#noscript").hide();
		let model = 
		frm.fromString(JSON.stringify(model));
		setFig1();
		setFig2();
	  });
	</script>
``` 
1. In its place, paste the text you copied from the browser. There are two important things to remember: you need to remove the outer quotes if present (the text must begin with `{` and end with `}` and add a semicolon at the end.

```
	<script>
	  $(document).ready(function(){
		$(".nosend").submit(function(e){ 
			e.preventDefault();
		});
		$("#noscript").hide();
		let model = {"original":"H2O=H.+OH,;AcH=Ac,+H.","k":[{"r":{"id":"k0_p","pos":1,"conc":2e-10,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k0_m","pos":1,"conc":1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}},{"r":{"id":"k1_p","pos":5,"conc":0}},{"r":{"id":"k2_p","pos":7,"conc":3.16,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k2_m","pos":7,"conc":0.1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}}],"species":{"H2O":{"conc":55000000,"show":false},"H_dot_":{"conc":0,"show":true},"OH_com_":{"conc":0,"show":true},"AcH":{"conc":0,"show":true},"Ac_com_":{"conc":0,"show":true}}};
		frm.fromString(JSON.stringify(model));
		setFig1();
		setFig2();
	  });
	</script>
``` 
1. Optionally, you can add other commands before `setFig1();` to customize the appearance. For instance, you can hide the formula and the concentration of hydroxyanions with `frm.hideFormula(); frm.hide("OH,")`:

```
	<script>
	  $(document).ready(function(){
		$(".nosend").submit(function(e){ 
			e.preventDefault();
		});
		$("#noscript").hide();
		let model = {"original":"H2O=H.+OH,;AcH=Ac,+H.","k":[{"r":{"id":"k0_p","pos":1,"conc":2e-10,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k0_m","pos":1,"conc":1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}},{"r":{"id":"k1_p","pos":5,"conc":0}},{"r":{"id":"k2_p","pos":7,"conc":3.16,"order":1,"units":"s<span class=\"super\">-1</span>"},"l":{"id":"k2_m","pos":7,"conc":0.1,"order":2,"units":"&micro;M<span class=\"super\">-1</span>s<span class=\"super\">-1</span>"}}],"species":{"H2O":{"conc":55000000,"show":false},"H_dot_":{"conc":0,"show":true},"OH_com_":{"conc":0,"show":true},"AcH":{"conc":0,"show":true},"Ac_com_":{"conc":0,"show":true}}};
		frm.fromString(JSON.stringify(model));
		
		frm.hideFormula(); 
		frm.hide("OH_com_");
		
		setFig1();
		setFig2();
	  });
	</script>
``` 
1. Save `buffer.html` and open it with the browser. If the developer console is still open, you can close it with `CTRL`+`SHIFT`+`I`.