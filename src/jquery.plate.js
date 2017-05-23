(function($) {
    'use strict';

    var namespace = 'jquery-plate';

    function Plate($element, options) {
        this.config(options);

        this.$container = $element;
        if (this.options.element) {
            if (typeof this.options.element === 'string') {
                this.$element = this.$container.find(this.options.element);
            } else {
                this.$element = $(this.options.element);
            }
        } else {
            this.$element = $element;
        }

        this.originalTransform = this.$element.css('transform');
        this.$container
            .on('mouseenter.' + namespace, this.onMouseEnter.bind(this))
            .on('mouseleave.' + namespace, this.onMouseLeave.bind(this))
            .on('mousemove.' + namespace, this.onMouseMove.bind(this));
    }

    Plate.prototype.config = function(options) {
        this.options = $.extend({
            inverse: false,
            perspective: 500,
            maxRotation: 10,
            animationDuration: 200
        }, this.options, options);
    };

    Plate.prototype.destroy = function() {
        this.$element.css('transform', this.originalTransform);
        this.$container.off('.' + namespace);
    };

    Plate.prototype.update = function(offsetX, offsetY, duration) {
        var rotateX;
        var rotateY;

        if (offsetX || offsetX === 0) {
            var height = this.$container.outerHeight();
            var py = (offsetY - height / 2) / (height / 2);
            rotateX = this.round(this.options.maxRotation * -py);
        } else {
            rotateY = 0;
        }

        if (offsetY || offsetY === 0) {
            var width = this.$container.outerWidth();
            var px = (offsetX - width / 2) / (width / 2);
            rotateY = this.round(this.options.maxRotation * px);
        } else {
            rotateX = 0;
        }

        if (this.options.inverse) {
            rotateX *= -1;
            rotateY *= -1;
        }

        if (duration) {
            this.animate(rotateX, rotateY, duration);
        } else if (this.animation && this.animation.remaining) {
            this.animation.targetX = rotateX;
            this.animation.targetY = rotateY;
        } else {
            this.transform(rotateX, rotateY);
        }
    };

    Plate.prototype.reset = function(duration) {
        this.update(null, null, duration);
    };

    Plate.prototype.transform = function(rotateX, rotateY) {
        this.currentX = rotateX;
        this.currentY = rotateY;
        this.$element.css('transform',
            (this.originalTransform && this.originalTransform !== 'none' ? this.originalTransform + ' ' : '') +
            'perspective(' + this.options.perspective + 'px) ' +
            'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)'
        );
    };

    Plate.prototype.animate = function(rotateX, rotateY, duration) {
        if (duration) {
            this.animation = this.animation || {};

            var remaining = this.animation.remaining;
            this.animation.time = performance.now();
            this.animation.remaining = duration || null;
            this.animation.targetX = rotateX;
            this.animation.targetY = rotateY;

            if (!remaining) {
                requestAnimationFrame(this.onAnimationFrame.bind(this));
            }
        } else {
            this.transform(rotateX, rotateY);
        }
    };

    Plate.prototype.round = function(number) {
        return Math.round(number * 1000) / 1000;
    };

    Plate.prototype.offsetCoords = function(event) {
        var offset = this.$container.offset();
        return {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
    };

    Plate.prototype.onAnimationFrame = function(timestamp) {
        this.animation = this.animation || {};

        var delta = timestamp - (this.animation.time || 0);
        this.animation.time = timestamp;

        var duration = this.animation.remaining || 0;
        var percent = Math.min(delta / duration, 1);
        var currentX = this.currentX || 0;
        var currentY = this.currentY || 0;
        var targetX = this.animation.targetX || 0;
        var targetY = this.animation.targetY || 0;
        var rotateX = this.round(currentX + (targetX - currentX) * percent);
        var rotateY = this.round(currentY + (targetY - currentY) * percent);
        this.transform(rotateX, rotateY);

        var remaining = duration - delta;
        this.animation.remaining = remaining > 0 ? remaining : null;
        if (remaining > 0) {
            requestAnimationFrame(this.onAnimationFrame.bind(this));
        }
    };

    Plate.prototype.onMouseEnter = function(event) {
        var offset = this.offsetCoords(event);
        this.update(offset.x, offset.y, this.options.animationDuration);
    };

    Plate.prototype.onMouseLeave = function(event) {
        this.reset(this.options.animationDuration);
    };

    Plate.prototype.onMouseMove = function(event) {
        var offset = this.offsetCoords(event);
        this.update(offset.x, offset.y);
    };

    $.fn.plate = function(options) {
        return this.each(function() {
            var $element = $(this);
            var plate = $element.data(namespace);

            if (options === 'remove') {
                plate.destroy();
                $element.data(namespace, null);
            } else {
                if (!plate) {
                    plate = new Plate($element, options);
                    $element.data(namespace, plate);
                    plate.reset();
                } else {
                    plate.config(options);
                }
            }
        });
    };

})(jQuery);
