var color_options = [
    '#00A0B0',
    '#CC333F',
    '#EB6841',
    '#FFC640',
    '#A0F235',
    '#6EA73C',
    '#13131A'
];

// A constructor for a color picker
// Takes a wrapper element and an array of CSS colors
var ColorBox = function(wrapper, colors) {
    // Get the width and height of the wrapper element so we can properly
    // size the color boxes
    var wrapper_width = wrapper.offsetWidth;
    var wrapper_height = wrapper.offsetHeight;

    var box_width = String(Math.floor(wrapper_width / colors.length)) + "px";
    var box_height = String(wrapper_height) + "px";

    this.cboxes = [];

    var self = this;
    // Create a span for each color
    for (var color_index in colors) {
        (function () {
            var cbox = document.createElement('span');
            cbox.className += 'colorbox-option';
            cbox.style.display = 'inline-block';

            cbox.style.width = box_width;
            cbox.style.height = box_height;

            var box_color = colors[color_index];
            cbox.style.backgroundColor = box_color;

            cbox.onclick = function() {
                self._setValue(cbox);
            }

            wrapper.appendChild(cbox);
            self.cboxes.push(cbox);
        })()
    }

    this._setValue = function(selected_cbox) {
        // Set the property of the object
        this.value = selected_cbox.style.backgroundColor;

        // Now go through and update the UI to indicate whih box
        // was selected
        for (var cbox_index in this.cboxes) {
            var target_cbox = this.cboxes[cbox_index];

            if (target_cbox == selected_cbox) {
                target_cbox.classList.add('colorbox-selected');
            } else {
                target_cbox.classList.remove('colorbox-selected');
            }
        }
    }

    this._setValue(this.cboxes[0]);
};
