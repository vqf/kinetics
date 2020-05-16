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

With this web page as a template, it is relatively easy to create customized pages for exercises. However, given the inability of `javascript` to write something to disk, this version requires manually editing the file. Any plain-text editor, like `Notepad` or `Notepad++` can be used. The idea is to edit the starting javascript code to set the model and its parameters. It is important to know that the `kinetics.js` module uses a global object called `frm`. The relevant functions to manipulate this object are:

-`frm.fromString(jsonText)`, which reads a `JSON` representation of the model (`jsonText`) and enters it.
-`frm.hideFormula()`, which hides the model.
-`frm.hide(species)`, which hides a given reactant or product.

One relatively simple way to create a web page with a custom model would be:

1. Copy `kinetics.html` with another name into the same folder. In this example, it will be `buffer.html`.
1. Set a model you are interested in showing. For instance, let us simulate an acetate buffer with `H2O=H.+OH,;AcH=Ac,+H.`. This will set four kinetic constants: k<sub>1</sub>, k<sub>-1</sub>, k<sub>3</sub> and k<sub>-3</sub>



