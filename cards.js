/*

css:
.card {
    position: absolute;
    left: 0px;
    top: 0px
    z-index: -1
}

Need to place cards in order.  When a card gets placed in a bin, move all the cards over.

When a card is clicked, adjust its z-index.

*/

const z_show = "1";
const z_hide = "0";

var currentCard;

function cardClick(elem) {
    currentCard.style.zIndex = z_hide;
    elem.style.zIndex = z_show;
    currentCard = elem;
}