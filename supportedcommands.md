### Supported Commands

#### Movement
* forward or fd
* back or bk
* right or rt
* left or lt
* setx
* sety

#### Drawing
* setpencolor or pc
* setbackground or bkg
* penup or pu
* pendown or pd
* clearscreen or cs

#### Turtle
* showturtle or st
* hideturtle or ht

#### Processing ####
* stop


#### Looping
* repeat or rep
* [  (Repeat block start)
* ] (Repeat block end) 

You must have 1 space after the [ and before the ]. 

Example

rep 10 [ fd 5 ] 

#### Functions
* to (start of a function block)
* end (indicates the end of a function block)

Example Code

to someFunction 
fd 1
end

someFunction   <--- Calls function

OR

to someFunctionTwo :n
fd :n
end

someFunctionTwo 2  <--- Calls function, passes in 2 for the :n variable. 

#### Variables
* ":" <-- colon.

Example Code

:somevar 5

