# kinetics
Kinetics simulator for virtual enzymology lessons. The video (`Additional_File_1.mp4`) shows an example of the workflow. Briefly, the interface consists of:

-A text box and a button (`Enter`) for mechanisms. A mechanism is made of reactions separated by semicolons. In a reaction, each side contains chemical symbols for reactants or products, possibly preceded by an integer, separated by `+`. Each side is separated by `=` if the reaction is considered reversible and `-` if it is considered irreversible (always to the right side). *Warning: in this version, the correct stoichiometry of the reaction is entirely up to the user.*

-Two buttons to `Simulate` the reaction or `Reset` to the last state prior to the simulation. Pressing `Simulate` again stops the simulation.

-A left panel to change the parameters of the mechanism and follow the concentrations of reactants and products. Each reaction is given two or one kinetic constant. The value of each constant can be changed by clicking on it (i. e., k<sub>1</sub>). *Warning: by default, concentrations are given in &micro;M, second- and higher-order constants must be presented in the corresponding units*. The concentration of each species is given below. For each species shown at the left with a unique color there is a graphical representation with a red rectangle and a number representation. Concentrations can be set by clicking on the rectangle or on the number. 

-A right panel with a graphical representation of each concentration through time. The color of each species is the same as in the left panel. Clicking on the name of the species at the left panel copies a table with the concentration of that species through time to the clipboard.

Coupled reactions can be written together (i. e., `E+S=ES-E+P`) or separately (`E+S=ES; ES-E+P`). The example in the video contains a mechanism for an enzyme `E` acting on a substrate `S` and inhibited competitively by `I` (`E+S=ES-E+P; EI=E+I`).

This simulator should be considered work in progress. There are some experimental features that may not work well, like subscripts and superscripts. Thus, you can write something like `H2SO4` and the formula will show H<sub>2</sub>SO<sub>4</sub>. Monovalent cations and anions can be written with `.` and `,`, respectively. For instance, you can represent a proton with `H.`. This version has no mechanism to represent multivalent ions.


