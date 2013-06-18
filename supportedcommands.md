### Supported Commands

#### Movement
* forward or fd
    - Moves the turtle (n) spaces forward, defaults to 1.
* back or bk 
    - Moves the turtle (n) spaces backward, defaults to 1.
* right or rt 
    - Moves the turtle (n) spaces right, defaults to 1.
* left or lt 
    - Moves the turtle (n) spaces left, defaults to 1.
* setx
    - Moves the turtle to the x coordinate.
* sety
    - Moves the turtle to the y coordinate.

#### Drawing
* setpencolor or pc
    - Sets the pen color to the HEX color value or the supported colors.
    - Supported Colors [HTML COLORS](http://www.computerhope.com/htmcolor.htm)
* setbackground or bkg
    - Sets the pen color to the HEX color value or the supported colors.
* penup or pu
    - Drawing disabled, movement will not draw. 
* pendown or pd
    - Drawning enabled, movement will draw.
* clearscreen or cs
    - Clear the canvas.

#### Turtle
* showturtle or st
    - Shows the turtle icon on the canvas.
* hideturtle or ht
    - Hides the turtle icon on the canvas.

#### Processing ####
* stop
    - Program halt.

#### Looping
* repeat or rep
* [  (Repeat block start)
* ] (Repeat block end) 
    - You must have 1 space after the [ and before the ]. 

##### Example Code

    rep 10 [ fd 5 ] 

#### Functions
* to
    - start of a function block
* end 
    - indicates the end of a function block

##### Example Code

    to someFunction 
     fd 1
    end

someFunction
(Calls function, simple, no arguments passed in)

OR

    to someFunctionTwo :n
     fd :n
    end

someFunctionTwo 2
(Calls function, passes in 2 for the :n arguments.)

#### Variables
* ":"
    - Just a colon, followed by the name of the variable, followed by the value.

##### Example Code

    :somevar 5

