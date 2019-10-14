var container;
var student = 'Jim';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    createCardStack();
    createCardBins();
}

function createCardStack() {
    let cardStack = document.getElementById('card-stack');
    let testCardNames = ['Rural', 'Urban', 'Small Class Size', 'Lots of green space'];

    cards = testCardNames;
    // cards = cardNames;

    for (let i = 0; i < cards.length; ++i) {
        let cardDiv = `<div id='card_${i}' class='card'  draggable='true' droppable='false' onclick='cardClick(this)' ondragstart='drag(event, this)'>${cards[i]}</div>`;
        cardStack.innerHTML += cardDiv;

        document.getElementById(`card_${i}`).style.zIndex = z_hide;
    }

    //
    currentCard = document.getElementById('card_0');
    currentCard.style.zIndex = z_show;

}

function createCardBins() {
    let cardBins = document.getElementById('card-bins');
    let cardBinNames = ['Must Have', 'Would Like To Have', 'Not Important', 'Do Not Want'];
    let cardBinId = ['must', 'would', 'not', 'do'];
    
    for (let i = 0; i < cardBinNames.length; ++i) {
        let cardBinDiv = `<div id='${cardBinId[i]}' class='card-bin' ondrop='transferCard(event, this)' ondragover='allowDrop(event)'>${cardBinNames[i]}</div>`;
        cardBins.innerHTML += cardBinDiv;
    }
    
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, el) {
    ev.dataTransfer.setData("card", ev.target.id);
    container = el.parentElement;
}

function transferCard(ev, el) {
    if(!ev.target.classList.contains('card-bin')) {
        return;
    }

    let data = ev.dataTransfer.getData("card");
    let card = document.getElementById(data);

    container.removeChild(card);
    ev.target.appendChild(card);
}

function downloadReport() {
    let report = "Must Have,Would Like To Have,Not Important,Do Not Want\n";

    let must_have = getDataForBin('must');
    let would_like = getDataForBin('would');
    let not_important = getDataForBin('not');
    let do_not_want = getDataForBin('do');

    report += generateTable(must_have, would_like, not_important, do_not_want);

    let student = document.getElementById('name').value;
    download(report, `${student}_cards.csv`);
}

function getDataForBin(bin_id) {
    let bin = document.getElementById(bin_id);
    let cards = new Array();

    for(let i = 1; i < bin.childNodes.length; ++i) {
        cards.push(bin.childNodes[i].textContent);
    }

    return cards;
}

function generateTable(must_have, would_like, not_important, do_not_want) {
    let max = Math.max(must_have.length, would_like.length, not_important.length, do_not_want.length);
    let table = "";
    for(let i = 0; i < max; ++i)
    {
        let line = "";
        
        line += getNextElement(must_have, i) + ',';
        line += getNextElement(would_like, i) + ',';
        line += getNextElement(not_important, i) + ',';
        line += getNextElement(do_not_want, i);
        line += '\n';

        table += line;
    }

    return table;
}

function getNextElement(array, index) {
    if (index < array.length) {
        return array[index];
    }

    return "";
}


///////////

function download(strData, strFileName, strMimeType = 'text/plain') {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function () {
        D.body.removeChild(f);
    }, 333);
    return true;
}