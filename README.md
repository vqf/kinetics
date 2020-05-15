# kinetics
Kinetics simulator for virtual enzymology lessons. The video (`Additional_File_1.mp4`) shows an example of the workflow. Briefly, the interface consists of:

-A text box and a button (`Enter`) for mechanisms. A mechanism is made of reactions separated by semicolons. In a reaction, each side contains chemical symbols for reactants or products, possibly preceded by an integer, separated by `+`. Each side is separated by `=` if the reaction is considered reversible and `-` if it is considered irreversible (always to the right side). *Warning: in this version, the correct stoichiometry of the reaction is entirely up to the user.*

-Two buttons to `Simulate` the reaction or `Reset` to the last state prior to the simulation. Pressing `Simulate` again stops the simulation.

-A panel (left) to change the parameters of the mechanism and follow the concentrations of reactants and products. Each reaction is given two or one kinetic constant. The value of each constant can be changed by clicking on it (i. e., `k_1`). *Warning: by default, concentrations are given in &micro;M, second- and higher-order constants must be presented in the corresponding units*.
