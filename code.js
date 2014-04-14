var primal_plane;
var dual_plane;

var next_key = 0;

var mapping = [];

document.body.onload = function() {
    // Set up the canvases
    primal_plane = new cg.Plane(
        'primal-plane',
        {
            width: 560,
            height: 420,
            originX: 'center',
            originY: 'center',
        }
    );
    dual_plane = new cg.Plane(
        'dual-plane',
        {
            width: 560,
            height: 420,
            originX: 'center',
            originY: 'center'
        }
    );

    // For some reason, the layout gets a bit screwed up when we construct
    // the canvases, so we need to do this our our offsets will be all wrong
    primal_plane.calcOffset();
    dual_plane.calcOffset();


    primal_plane.on('mouse:miss', function(e) {
        add_point_and_line(e.x, e.y, primal_plane, dual_plane);
    });

    primal_plane.on('object:move', function(e) {

    });

    dual_plane.on('mouse:miss', function(e) {
        add_point_and_line(e.x, e.y, dual_plane, primal_plane);
    });

}

function add_point_and_line(x, y, point_plane, line_plane) {
    var point = new cg.Point(x, y);
    point.key = next_key;
    point_plane.add(point);

    // Compute the slope and intercept
    var slope = point_plane._planeX(x);
    var intercept = line_plane._nativeY(- point_plane._planeY(y));

    // Adjust translate the intercept relative to the center origin

    var line = new cg.Line(slope, line_plane._nativeX(0), intercept);
    line.key = next_key;
    line_plane.add(line);

    //TODO fix this
    mapping[next_key++] = {point: point, line: point};
}
