var page = require('webpage').create(),
    system = require('system'),
    address, selector;

if (system.args.length < 4) {
    console.log('Usage: ' + system.args[0] + ' <some URL> <some selector> <destination.png>');
    phantom.exit();
}
address = system.args[1];
selector = system.args[2];
output = system.args[3];
page.viewportSize = { width: 800, height: 600 };
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to access the network!');
    } else {
        var dimetions = page.evaluate(function (selector) {
            el = document.querySelector(selector);
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
        }, selector);

        page.clipRect = { top: dimetions.top, left: dimetions.left, width: dimetions.width, height: dimetions.height };
        page.render(output);
        //});
    }
    phantom.exit();
});
