var page = require('webpage').create(),
    system = require('system'),
    fs = require("fs"),
    address, selector, images;

if (system.args.length < 4) {
    console.log('Usage: ' + system.args[0] + ' <some URL> <some selector> <destination.png>');
    phantom.exit();
}
address = system.args[1];
selector = system.args[2].split(':');
output = system.args[3];
images = [];
page.viewportSize = { width: 800, height: 600 };
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to access the network!');
    } else {
        var i, len;
        for (i = 0,len = selector.length; i < len; i++) {

            var dimetions = page.evaluate(function (selector) {
                el = document.querySelector(selector);
                if(el == null) {
                    return null;
                }
                var curTop = 0, curLeft = 0, obj = el;
                do {
                    curLeft += obj.offsetLeft;
                    curTop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                

                return {
                    height: el.offsetHeight,
                    width: el.offsetWidth,
                    top: curTop,
                    left: curLeft
                }
            }, selector[i]);
        
        

            page.clipRect = { top: dimetions.top, left: dimetions.left, width: dimetions.width, height: dimetions.height };
            images.push(page.renderBase64('png'));
        }
        

        page.evaluate(function (image_data, selector) {
            var i, len;
            for (i = 0,len = selector.length; i < len; i++) {
                if (image_data[i] == null) continue;
                var img = new Image();
                img.src = "data:image/png;base64," + image_data[i].toString();
                el = document.querySelector(selector[i]);
                el.innerHTML = "";
                el.appendChild(img);
            }

            // Delete all script nodes.
            // var scripts = document.querySelectorAll('script').delete ??
        }, images, selector);

        fs.write(output, page.content, 'w');
    }
    phantom.exit();
});
