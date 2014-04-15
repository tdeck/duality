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

    primal_plane.on('object:moving', function(e) {
        object = primal_plane.getActiveObject();
        if (object instanceof cg.Point) {
            moved_point(object);
        }
    });

    dual_plane.on('mouse:miss', function(e) {
        add_point_and_line(e.x, e.y, dual_plane, primal_plane);
    });

    dual_plane.on('object:moving', function(e) {
        object = dual_plane.getActiveObject();
        if (object instanceof cg.Point) {
            moved_point(object);
        }
    });

}


function add_point_and_line(x, y, point_plane, line_plane) {
    var point = new cg.Point(x, y);
    point.key = next_key;
    point_plane.add(point);

    var line = new cg.Line(0, line_plane._nativeX(0), line_plane._nativeY(0));
    line.key = next_key;
    line_plane.add(line);

    //TODO fix this
    mapping[next_key] = {
        point: point, 
        line: line,
        point_plane: point_plane,
        line_plane: line_plane
    };

    moved_point(point);

    ++ next_key;
}

function moved_point(point) {
    var entry = mapping[point.key];
    var line = entry.line;
    var point_plane = entry.point_plane;
    var line_plane = entry.line_plane;

    var x = point.getLeft();
    var y = point.getTop();

    var slope = point_plane._planeX(x);
    var intercept = line_plane._nativeY(- point_plane._planeY(y));

    line.setSlope(slope).setIntercept(intercept);
    // Unfortunately this is the only way to get updates as we drag a point,
    // and it's pretty slow on my machine.
    line_plane.renderAll();
}
