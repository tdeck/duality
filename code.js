var primal_plane;
var dual_plane;

var next_key = 0;

var mapping = [];

var primal_color_picker;
var dual_color_picker;

document.body.onload = function() {
    // Grab refs to the color pickers
    primal_color_picker = new ColorBox(
        document.getElementById('primal-color'),
        color_options
    );
    dual_color_picker = new ColorBox(
        document.getElementById('dual-color'),
        color_options
    );

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

    // TODO something better than this
    primal_plane.picker = primal_color_picker;
    dual_plane.picker = dual_color_picker;

    // For some reason, the layout gets a bit screwed up when we construct
    // the canvases, so we need to do this our our offsets will be all wrong
    primal_plane.calcOffset();
    dual_plane.calcOffset();

    // Primal plane event listeners
    primal_plane.on('mouse:miss', function(e) {
        add_point_and_line(e.x, e.y, primal_plane, dual_plane);
    });

    primal_plane.on('object:moving', function(e) {
        translation_handler(e, primal_plane);
    });

    primal_plane.on('object:rotating', function(e) {
        translation_handler(e, primal_plane);
    });

    primal_plane.on('mouse:rhit', delete_handler);


    // Dual plane event listeners
    dual_plane.on('mouse:miss', function(e) {
        add_point_and_line(e.x, e.y, dual_plane, primal_plane);
    });

    dual_plane.on('object:moving', function(e) {
        translation_handler(e, dual_plane);
    });

    dual_plane.on('object:rotating', function(e) {
        translation_handler(e, dual_plane);
    });

    dual_plane.on('mouse:rhit', delete_handler);
}

function translation_handler(e, plane) {
    object = plane.getActiveObject();
    if (object instanceof cg.Point) {
        moved_point(object);
    } else if (object instanceof cg.Line) {
        moved_line(object);
    }
}

function delete_handler(e) {
    var key = e.target.key;
    
    var pair = mapping[key];
    
    pair.point_plane.remove(pair.point);
    pair.line_plane.remove(pair.line);

    pair.point_plane.renderAll();
    pair.line_plane.renderAll();
}

function add_point_and_line(x, y, point_plane, line_plane) {
    var point = new cg.Point(x, y, {
        fill: point_plane.picker.value    
    });
    point.key = next_key;
    point_plane.add(point);

    var line = new cg.Line(0, line_plane._nativeX(0), line_plane._nativeY(0), {
        stroke: point_plane.picker.value,
        fill: point_plane.picker.value    
    });
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
    // and it's pretty slow on my machine using FF.
    line_plane.renderAll();
}

function moved_line(line) {
    var entry = mapping[line.key];
    var point = entry.point;
    var point_plane = entry.point_plane;
    var line_plane = entry.line_plane;

    var slope = line.getSlope();
    var intercept = line_plane._planeY(line.getIntercept());
    console.log("Slope:", slope);

    point.setLeft(point_plane._nativeX(-slope));
    point.setTop(point_plane._nativeY(-intercept));

    // This probably shouldn't be needed, but it seems like it is
    point.setCoords();

    point_plane.renderAll();
}
