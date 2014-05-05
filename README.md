Point-Line Duality
==================

What is duality?
----------------
[Duality](http://en.wikipedia.org/wiki/Duality_%28projective_geometry%29) is the
geometric concept of defining a mapping between points in one plane 
(the "primal plane") and lines in another (the "dual plane"). The basic idea
is that a point ![(a,b)](http://www.sciweavers.org/tex2img.php?eq=%28a%2C%20b%29&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)
maps to a line ![y = ax - b](http://www.sciweavers.org/tex2img.php?eq=y%20%3D%20ax%20-%20b&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)
in the dual plane, and vice-versa (![y = ax + b <-> (a, -b)](http://www.sciweavers.org/tex2img.php?eq=y%20%3D%20ax%20%2B%20b%20%20%5Cleftrightarrow%20%28a%2C%20-b%29&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)). Believe it or not,
this is both cool and useful!

What is the demo?
-----------------
The demo is an interactive visualization that lets you create points and lines
in either of two planes, drag them around, and watch as the dual transforms
according to the primal-dual mapping. You can create points and lines of 
different colors to help visualize different scenarios, and you can delete
objects. 

Why did you write it?
---------------------
The idea of duality can be very helpful in approaching 2-D geometric
problems, but it's often hard to visualize how a
set of points in the plane will translate to a dual arrangement. There exists
at least one [java applet](http://nms.lcs.mit.edu/~aklmiu/6.838/dual/) that
demonstrates this, along with extra functionality, but many of us now have
Java disabled in our browsers.
This was a quick and dirty attempt to get something I could play with when 
trying to develop algorithms for my 
[computational geometry](http://www.cse.wustl.edu/~taoju/cse546/) homework. 
I hope that someone else will find it useful as well.

How did you write it?
---------------------
The demo is a self-contained client-side web application written in JavaScript
using the [Fabric.js](http://fabricjs.com/) canvas library. I hacked about
with Fabric enough to make it handle plane objects the way I wanted it, then
wrote my own custom color picker. (Yes, I know there are a million out there,
but I wanted one with a few discrete color choices.) The JS is pretty standard;
don't expect it to work on your old version of IE or Mosaic or WorldWideWeb.
