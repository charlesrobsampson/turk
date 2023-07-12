# Turk's Head Knot
A Turk's Head is a type of decorative knot that can be used for many different situations. I personally make rings out of them.

They consist of leads and bights. The leads are essentially how many passes around the knot and the bights are how many passes there are going the other way.
For example a 3 lead 5 bight would look like this
```
b:| 1                 2                 3                 4                 5                |
  |    j           g     f           c     b           i     h           e     d           a |
  |       j     g           f     c           b     i           h     e           d     a    |
  |          j                 f                 b                 h                 d       |
  |       g     j           c     f           i     b           e     h           a     d    |
  |    g           j     c           f     i           b     e           h     a           d |
  | g                 c                 i                 e                 a                |
  |    d           c     j           i     f           e     b           a     h           g |
  |       d     c           j     i           f     e           b     a           h     g    |
b:|          2                 3                 4                 5                 6       |
```
Imagine wraping this image around and lining up the pipes `|` so that it makes a cylinder.

The numbers `1 - 5` are the bights. The leads are a little harder to see exaclty but there are only 3 line segments (the letters) in line with each other from top to bottom. For example, if you take the space just to the right of the `3` on the top, you can see the letters `b`, `i`, then `f` going straight down. Those are the leads. You can see how the weave works by noting the letter that is shown at an intersection. That is the segment on top. if you follow segment a going from `5` to `1`, you'll see that it goes over `h` and then under `d`.

The more leads you have, the taller the cylinder would be. More bights would increase the circumference.

`**NOTE:
You cannot make a Turk's Head where the leads and bights share a common denominator, the code will tell you if what you have requested won't work.`
## Using the code
You'll need nodejs installed, then simply clone the repo and run `index.js`
### index.js
```
usage:
    node index.js -l <leads> -b <bights> -t <teeth> [img]
    -l  number of leads         [required]
    -b  number of bights        [required]
    -t  number of teeths        [required]
    img show pics of each step  [optional]
```
The teeth will correlate with your jig's setup. However many teeth or prongs you have on your jig will be how many teeth you put in the command.

the `img` flag will dictate whether or not it shows each step or just gives you the finished product.
```
node index.js -l 3 -b 5 -t 10
```
will return
```
steps to create turks head with
    5 bights
    3 leads
    on a jig with 10 teeth
    wrap going clockwise
    
┌─────────┬───────┬───────┬──────────┬───────┬─────────┬─────────┐
│ (index) │ tooth │ bight │   side   │ pass1 │ segment │ pattern │
├─────────┼───────┼───────┼──────────┼───────┼─────────┼─────────┤
│    0    │   1   │   1   │  'top'   │   0   │         │         │
│    1    │   8   │  4.5  │ 'bottom' │   1   │   'a'   │         │
│    2    │   5   │   3   │  'top'   │   0   │   'b'   │         │
│    3    │   2   │  1.5  │ 'bottom' │   0   │   'c'   │         │
│    4    │   9   │   5   │  'top'   │   1   │   'd'   │   'o'   │
│    5    │   6   │  3.5  │ 'bottom' │   0   │   'e'   │   'o'   │
│    6    │   3   │   2   │  'top'   │   0   │   'f'   │   'o'   │
│    7    │  10   │  5.5  │ 'bottom' │   1   │   'g'   │   'o'   │
│    8    │   7   │   4   │  'top'   │   0   │   'h'   │  'u,o'  │
│    9    │   4   │  2.5  │ 'bottom' │   0   │   'i'   │  'u,o'  │
│   10    │   1   │   1   │  'top'   │   0   │   'j'   │  'u,o'  │
└─────────┴───────┴───────┴──────────┴───────┴─────────┴─────────┘
b:| 1                 2                 3                 4                 5                |
t:| 1                 3                 5                 7                 9                |
  |    j           g     f           c     b           i     h           e     d           a |
  |       j     g           f     c           b     i           h     e           d     a    |
  |          j                 f                 b                 h                 d       |
  |       g     j           c     f           i     b           e     h           a     d    |
  |    g           j     c           f     i           b     e           h     a           d |
  | g                 c                 i                 e                 a                |
  |    d           c     j           i     f           e     b           a     h           g |
  |       d     c           j     i           f     e           b     a           h     g    |
t:|          2                 4                 6                 8                10       |
b:| 1                 2                 3                 4                 5                |
```
The table gives you the steps and then you can see the final product.

Each step will tell you the tooth your are going to and the bight associated with that tooth. It'll also tell you if you should be on the top or bottom of your jig. Pass1 means you'll be crossing the where the pipes `|` are aligned (passing `GO` in Monopoly, if you will). In the case where you have many leads and fewer bights. you might pass this multiple times in each step. In the 3 by 5, it's around every 3 steps you cross. The segment isn't super crucial for the tying, it's mostly as a visual aid for following the generated image. The pattern will tell you to go over (`o`) or under (`u`) each other segment you pass for the step you're on. In step `4` you would be going to tooth `9` on the `top` of the jig, you will pass 1 `1` time and you will cross over (`o`) segment `a` on the way to get there. It doesn't explicitly say you will cross `a` but it is the only segment to interact with and you can see it in the image.

In the case where there are mutiple intersections like in step `9`, you would be going to tooth `4`, for bight `2.5` (when you have an odd number of lead, the top and bottom bights are offset halfway between each other so I have called them half bights. Even leads will have the bights aligned) on the `bottom`. You won't cross 1 but you will go under (`u`) segment `b` and then over (`o`) segment `f`. The pattern is in the order of segments you intersect with.

If you provide the `img` flag
```
node index.js -l 3 -b 5 -t 10 img
```
your output will be
```
steps to create turks head with
    5 bights
    3 leads
    on a jig with 10 teeth
    
------step 1------
┌─────────┬─────────┬───────┬───────┬──────────┬─────────┐
│ (index) │ segment │ tooth │ bight │   side   │ pattern │
├─────────┼─────────┼───────┼───────┼──────────┼─────────┤
│  from   │   'a'   │   1   │   1   │  'top'   │         │
│   to    │   'a'   │   8   │  4.5  │ 'bottom' │   ''    │
└─────────┴─────────┴───────┴───────┴──────────┴─────────┘
b:| 1                 2                 3                 4                 5                |
t:| 1                 3                 5                 7                 9                |
  |                                                                                        a |
  |                                                                                     a    |
  |                                                                                  a       |
  |                                                                               a          |
  |                                                                            a             |
  |                                                                         a                |
  |                                                                      a                   |
  |                                                                   a                      |
t:|          2                 4                 6                 8                10       |
b:| 1                 2                 3                 4                 5                |
------step 2------
...
```
The `...` signify that each step will print a very similar image, just with the next segment added. The steps follow the same idea as the final table with all steps, however, this only shows the new step in the image. This will also output the full table and final image at the very end.

## Making your own jig
Here's my current jig
![jig](imgs/jig.jpg)
It's about 5.5 in tall with a diameter of 1.5 in.

It has 63 teeth that are about 2 mm wide and about .5 in tall. Sorry for the mixed units, but not really, deal with it.

### the jig
I used the plastic tube that the s-lon thread I was using for the ring came in, why? Cuz it was convenient.
![s-lon tube](imgs/slontube.jpg)
Pretty much any tube (Smart Water bottle, PVC pipe, soda can [maybe kinda sharp for this], shapmoo bottle, whatever) that is a reasonable size for what you're hoping to make will work. Well, make sure it's not super thick since that would make creating the teeth a nightmare (PVC might be too thick unless you have some good tools).

I had originally made one out of a toilet paper tube, but it didn't last very long since it's cardboard, so I wouldn't recommend it. If you're in a pinch though and you really need a jig to make a turks head, do it. Also, email the details of the scenario for that, I'm curious.

Measure the circumference of your tube of choice and then find a measurement that makes the teeth wide enough but also gives you enough teeth to handle your needs. The isnpiration for this came from researching other solutions for jigs and I didn't like any of them. You had to either set up your jig (oh, also buy one, pfff) specific to the Turk's head you wanted to make or print out a pattern to tape onto a tube... but I ain't got no printer. So here we are.

Once you have determined the width of your teeth, measure around the tube and mark where all the teeth should be. I used a fabric measuring tape and taped it to one spot and the wrapped it around the tube and marked every 2 mm with a Sharpie, but you do you. Flip it over and do it to the other side. I tried my eyeballest best to draw a line straight down the cylinder to start the teeth at the same spot. This doesn't really need to be straight, nor is it really necessary. It was just kinda nice to use to mark when I was going around the tube.

After the teeth are marked you can go about cutting them with your favorite cutting tool (I used scissors). Before I cut mine, I made a line around the ends to try and cut to these. I laid the Sharpie on a table and stood the tube on one end and rolled it to get an even line on each end. If you pay close attention to the image of the jig, I didn't use that line. It was too close to the end for the teeth to be effective so then I re-cut all the teeth to about 1/2 in. You could try and get a line to cut to or just eyeball it. Whatever you wanna do. This is just a knot after all.

Once you have your teeth cut, or before... I don't really care, I would recommend marking numbers for your teeth starting with the line that goes top to bottom. I have bad handwriting and a fat Sharpie so I could only fit numbers for every third tooth. As you can see, the numbering goes `1..4..7..10` I put the first digit of double digit numbers on top and then the ones place below it to conserve horizontal space... but yeah, you do you. You just want to be able to know which tooth is where.

Boom! There you have it!

If you want to see the other options I'm talking about you can just [Google some Turk's Head Jigs](https://www.google.com/search?q=turks+head+jig) or check out [this website](http://www.folsoms.net/knots/tejay/index.htm) that talks about how to use a pattern on any old tube to make one. I actually used this website a ton when writing this code, so super props to this Folsom guy.

### the shuttle
coming soon