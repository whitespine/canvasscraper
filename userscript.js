// ==UserScript==
// @name         DownloadDaemon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Steal scholastics shit.
// @author       Jacob Henry (github.com/whitespine)
// @match        https://canvas.wpi.edu/files*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==



(function() {
    'use strict';

    var FILE_SEP = ";FSEP;"; // How we separate individual entries representing files
    var ELT_SEP = ";ESEP;"; // How we separate elements of said entries
    var PATH_SEP = ";PSEP;"; // Within entries that are paths, how we separate folders/files

    // Save history to store
    function saveHistory(history) {
        // Convert
        var s = dumpHistory(history);

        // Copy to user clipboard
        GM_setClipboard(s, "text");
        console.log(s);

        // Put to storage
        GM_setValue("canvasDumpExplored", s);
    }

    // Convert history to format FULL_IDENTIFIER@AUTOGENNED_FILENAME@INDIVIDUAL_FILENAME
    function dumpHistory(history) {
        // Initiate our string
        var s = "";

        // Go through pairs
        for(var key in history) {
            if(key == undefined || key == "") {
                continue;
            }

            // Add a file sep if necessary
            if(s.length > 0) {
                s += FILE_SEP;
            }

            // Add the elts
            s += key;
            s += ELT_SEP;
            s += history[key][0];
            s += ELT_SEP;
            s += history[key][1];
        }

        return s;
    }

    // Load history from store
    function loadHistory() {
        var d = {};
        var tuples = GM_getValue("canvasDumpExplored", "").split(FILE_SEP);
        tuples.forEach(function(element) {
            element = element.split(ELT_SEP);
            d[element[0]] = [element[1], element[2]];
        });
        return d;
    }


    // Generate a random, probably unique identifier
    function randIdentifier() {
        var s = "";
        var i;
        var arr = "abcdefghijklmnopqrstuvwxyz".split("");
        for (i = 0; i < 20; i++) {
            s += arr[Math.floor(Math.random() * (26))];
        }
        return s;
    }

    // Get jquery
    var $ = window.jQuery;

    // Load history of already downloaded links
    var manifest = loadHistory();

    function downloadClicker() {
        $("a[href].ef-name-col__link").each(function( index ) {
            var file_or_folder = $( this ).attr("href");

            // Depending on if its a file or a folder, try to download
            if (file_or_folder[0] != "/") {
                // Get our directory path - where the file is in the tree, which we will later want to reconstruct
                var directory = $($("#breadcrumbs").children("ul").children("li").find("span").toArray().slice(2)).map(function( index, val ) {
                    return $(val).text();
                }).toArray().join(PATH_SEP);

                // Get the file's individual name
                var filename = $( this ).text();

                // Construct the full name by merging the above two
                var fullname = directory + PATH_SEP + filename;

                // Check if we've downloaded in past
                if (fullname in manifest) {
                    return true;
                }

                // Otherwise, give it a new name and save it
                var new_name = randIdentifier();

                // Save to history as a pair (downloaded file name, original file name)
                manifest[fullname] = [new_name, filename];
                saveHistory(manifest);

                // Do the download
                console.log("Downloading " + filename);
                GM_download(file_or_folder, new_name);
                return false;
            }

        });
        saveHistory(manifest);
    }

    // Whether to clear cache or not
    var clearMode = false;

    if (clearMode) {
        console.log("Clearing");
        GM_setValue("canvasDumpExplored", "");
        console.log("Cleared");
    }

    // Run
    console.log("Looping scan");
    downloadClicker();
    var i = setInterval(function() {
        downloadClicker();
    }, 500);

})();