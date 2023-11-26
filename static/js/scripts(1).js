
$('#like').click(function() {
    $("i", this).toggleClass("bi bi-heart bi bi-heart-fill");
});

$('#upvote').click(function() {
    $("i", this).toggleClass("bi bi-arrow-up-circle bi bi-arrow-up-circle-fill");
});

$('#downvote').click(function() {
    $("i", this).toggleClass("bi bi-arrow-down-circle bi bi-arrow-down-circle-fill");
});

