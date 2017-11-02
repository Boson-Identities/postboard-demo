(function() {
    $(window).on('load', function() {
        var shoutCount = $('#shout-count');
        $('textarea[name=shout]').on('input', function() {
            var maxlength = this.getAttribute('maxlength');
            var currentLength = this.value.length;

            shoutCount.text(maxlength-currentLength);
        });
    })
})();
