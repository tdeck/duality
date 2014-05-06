// Point properties
var POINT_RADIUS = 4;
var POINT_COLOR = 'blue';

// Line properties
var LINE_WIDTH = 3;
var LINE_COLOR = 'red';

var DEG_PER_RAD = 360 / (2 * Math.PI);

// Used t oemulate infinity for lines
var FAR_AWAY = 1000;


cg = {
    Plane: fabric.util.createClass(fabric.Canvas, {
        initialize: function(element_id, options) {
            options = options || {};

            options.selection = options.selection || false;

            // Center the origin
            options.originX = 'center';
            options.originY = 'center';

            // These options cannot be changed after the plane is created
            // Hey, it's better than nothing!
            this._minX = options.minX || -1;
            this._maxX = options.maxX || 1;
            this._minY = options.minY || -1;
            this._maxY = options.maxY || 1;

            this._xRange = this._maxX - this._minX;
            this._yRange = this._maxY - this._minY;

            this.callSuper('initialize', element_id, options);

            // Attach a handler for the new "mouse:miss" event
            var self = this;
            this.on('mouse:up', function(e) {
                // Attach the coordinates (not sure why fabric doesn't do this)
                var coords = self.getPointer(e.e);
                e.x = coords.x;
                e.y = coords.y;

                // This line was taken from the fabric JS mixin code
                var isLeftClick  = 'which' in e.e ? e.e.which === 1 : e.e.button === 1;

                // Discriminate hits 
                var target;
                if (
                    target =
                        self.getActiveObject() || // Single object drag
                        self.getActiveGroup() || // Group drag
                        self.findTarget(e.e) // Some other target
                ) {
                    e.target = target; // TODO check this
                    self.fire(
                        isLeftClick ? 'mouse:hit' : 'mouse:rhit',
                        e
                    );
                } else {
                    self.fire(
                        isLeftClick ? 'mouse:miss' : 'mouse:rmiss',
                        e
                    );
                }
            });
            
            // Disable the context menu so we can use right clicks
            var raw_canvas = this.upperCanvasEl;
            raw_canvas.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, false);
        },

        // Override
        /*
        add: function(object) {
            // TODO see if we can do any good here
            this.callSuper('add', object);
        },
        */

        // Set of functions to translate coordinates
        // These are marked with a _ because we really shouldn't have to
        // call them externally, the plane should be able to scale objects
        // to its own coordinate system. Unfortunately this is too much work
        // TODO right now.
        _planeX: function(nativeX) { 
            return nativeX * (this._xRange / this.width) + this._minX;
        },
        _planeY: function(nativeY) { 
            return (
                (this.height - nativeY) * // Need to invert the Y-coordinate
                (this._yRange / this.height) +
                this._minY
            );
        },
        _nativeX: function(planeX) {
            return (planeX - this._minX) * (this.width / this._xRange);
        },
        _nativeY: function(planeY) {
            return (this.height - (
                (planeY - this._minY) * 
                (this.height / this._yRange)
            ));
        }
    }),

    Point: fabric.util.createClass(fabric.Circle, {
        initialize: function(x, y, options) {
            options = options || {};

            // Set the coordinates
            options.left = x;
            options.top = y;

            // Set the visual style
            options.fill = options.fill || POINT_COLOR;
            options.radius = options.radius || POINT_RADIUS;

            // Make the point draggable but not scalable
            options.hasBorders = false;
            options.hasControls = false;
            options.hasRotatingPoint = false;
            options.lockScalingX = true;
            options.lockScalingY = true;

            this.callSuper('initialize', options);
        },
        
        toString: function() {
            return "(" + this.left + ", " + this.top + ")";
        }
    }),

    Line: fabric.util.createClass(fabric.Line, {
        initialize: function(slope, centerX, centerY, options) {
            // TODO remove centerX entirely!
            options = options || {};

            // Disable line scaling
            options.hasBorders = false;
            options.hasControls = true;
            options.hasRotatingPoint = true;
            options.lockScalingX = true;
            options.lockScalingY = true;
            options.lockMovementX = true;
            options.selectable = true;
            options.padding = 2;

            // Rotate the line about its center
            options.centerRotation = true;
            options.originX = 'center';
            options.orignY = 'center';

            // Set the visual style);
            options.fill = options.fill || LINE_COLOR;
            options.stroke = options.stroke || LINE_COLOR;
            options.strokeWidth = options.strokeWidth || LINE_WIDTH;

            this.callSuper(
                'initialize', 
                [centerX-FAR_AWAY, centerY, centerX+FAR_AWAY, centerY], 
                options
            );

            this._centerX = centerX;
            this.setSlope(slope);
            //this.setIntercept(centerY);
            //TODO
        },

        setSlope: function(slope) {
            console.log("Slope", slope);
            this.setAngle(- Math.atan(slope) * DEG_PER_RAD);
            this.setCoords();

            return this; // For utility
        },

        getSlope: function(slope) {
            return Math.tan(this.angle / DEG_PER_RAD);
        },

        setIntercept: function(intercept) {
            this.top = intercept;
            this.setCoords();
            return this;
        },

        getIntercept: function() {
            return this.top;
        },

        toString: function() {
            return this.slope + "x + " + this.intercept;
        }
    })
};
