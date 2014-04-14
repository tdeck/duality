// Point properties
var POINT_RADIUS = 4;
var POINT_COLOR = 'blue';

// Line properties
var LINE_WIDTH = 2;
var LINE_COLOR = 'red';

var DEG_PER_RAD = 360 / (2 * Math.PI);


cg = {
    Plane: fabric.util.createClass(fabric.Canvas, {
        initialize: function(element_id, options) {
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

                // Discriminate hits 
                var target;
                if (
                    target =
                        self.getActiveObject() || // Ignore single object drag
                        self.getActiveGroup() // Ignore group drag
                ) {
                    e.target = target; // TODO check this
                    self.fire('mouse:hit', e);
                } else {
                    self.fire('mouse:miss', e);
                }
            });
        },

        // Set of functions to translate coordinates
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
            options = options || {};

            // Disable line scaling
            options.hasBorders = false;
            options.hasControls = false;
            options.lockScalingX = true;
            options.lockScalingY = true;

            // Rotate the line to match the slope
            options.angle = Math.atan(slope) * DEG_PER_RAD;
            options.centerRotation = true;

            options.originX = 'center';
            options.orignY = 'center';

            // Set the visual style
            options.fill = options.fill || LINE_COLOR;
            options.stroke = options.stroke || LINE_COLOR;
            options.strokeWidth = options.strokeWidth || LINE_WIDTH;

            this.callSuper(
                'initialize', 
                [centerX-10000, centerY, centerX+10000, centerY], 
                options
            );

            this.slope = slope;
            this.intercept = centerY;
        },

        toString: function() {
            return this.slope + "x + " + this.intercept;
        }
    })
};
