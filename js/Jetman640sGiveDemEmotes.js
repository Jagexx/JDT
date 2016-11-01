// ==UserScript==
// @name         𝑔𝑖𝑣𝑒 𝑑𝑒𝑚 𝑒𝑚𝑜𝑡𝑒𝑠(Jetman640 vs23)
// @version      1.2
// @description  part of the ReDub script, but since it will take a while (or maybe never) to release and this is already done I'm taking it apart into it's own script
// @author       Netux
// @contact		 Dubtrack → netux | GitHub → Netox005
// @run-at		 document-body
// @match        https://*.dubtrack.fm/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var shitisready = false;
    var shitisset = false;
    var shitissetting = false;
    function checkIfReDub() {
        if(window.ReDub) {
            Dubtrack.helpers.displayError(
                // Title
                '<span style="font-style=italic;">give dem emotes</span> won\'t run. ReDub found',
                // Content
                'It seems like you already have ReDub to convert emotes!' + '<br/>' +
                'If you use a script loader (Greasemonkey or Tampermonkey) and don\'t want to get this message everytime you load Dubtrack, do one of the following:' +
                '<ul style="margin: 0; padding: 0 1.25rem; list-style: initial; font-weight: 700;">' +
                '	<li>Disable <span style="font-style=italic;">give dem emotes</span> script</li>' +
                '	<li>Disable ReDub script <small>(this will also disable all features from ReDub)</small></li>' +
                '</ul>' +
                '<p style="border-top: 1px solid black;">If you ran <span style="font-style=italic;">give dem emotes</span> from a bookmarklet then just click OK and don\'t do that again :P.</p>'
            );
            return true;
        }
        return false;
    }
    if(checkIfReDub())
        return;

    function GiveDemEmotes() {
        var emoteList = {
            twitchtv: false,
            bettertwitchtv: false,
            tastycat: false,
            frankerfacez: false,
            redub: false,
            room: false
        },
            toLoad = Object.keys(emoteList).length - 1,
            emoteConvertionsCount = 0,
            groupRegexp = {
                'twitchtv|ttv|tv': 'twitchtv',
                'bettertwitchtv|betterttv|bttv|btv': 'bettertwitchtv',
                'tastycat|tc|tastyplug|tp|tasty|t': 'tastycat',
                'frankerfacez|frfz|ffz|ff': 'frankerfacez',
                'redub|rdb|rdub': 'redub',
                'room|rm|r': 'room'
            },
            links = {
                twitchtv_api_endpoint: 'https://api.twitch.tv/kraken/chat/emoticon_images?client_id=8wp4lgj9udvwerx7xb1kqz8yci0p7p0',
                twitchtv_image_endpoint: 'https://static-cdn.jtvnw.net/emoticons/v1/%id%/%size%.0',

                bettertwitchtv_api_endpoint: 'https://api.betterttv.net/2/emotes',
                bettertwitchtv_image_endpoint: 'https://cdn.betterttv.net/emote/%id%/%size%x',

                tastycat_api_endpoint: 'https://raw.githubusercontent.com/sinfulBA/DubX-Script/master/emotes/emotes.json', 				 // sinful's DubX host
                // tastycat_images_endpoint: {using imageSrc variable}

                frankerfacez_api_endpoint: 'https://rawgit.com/Jiiks/BetterDiscordApp/master/data/emotedata_ffz.json',	   				 // Jiiks's BetterDiscord host
                frankerfacez_image_endpoint: 'https://cdn.frankerfacez.com/emoticon/%id%/%size%',

                redub_api_endpoint: 'https://github.netux.ml/userscript/redub/emotes.json',
                //redub_api_endpoint: "https://raw.githubusercontent.com/Jetman640/Junk/master/CompiledEmotes.json",
                // redub_images_endpoint: {using regexp value}


                triggered_sign_image_endpoint: 'https://github.netux.ml/userscript/redub/triggered_sign.png'
            };
        /* Render */ {
            $('<style id="redub-stylesheet-emotesonly">' +
              // Loading
              '#chat .chat-container .chat-messages .chat-main li .redub.loading-emote,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.loading-emote {' +
              '	color: #808080;' +
              ' 	height: 2em;' +
              ' 	line-height: 2em;' +
              '	vertical-align: bottom;' +
              '	vertical-align: text-bottom;' +
              ' 	display: inline-block;' +
              '}' +
              // Error
              '#chat .chat-container .chat-messages .chat-main li .redub.error-emote,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.error-emote {' +
              ' 	position: relative;' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.error-emote::after,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.error-emote::after {' +
              '    position: absolute;' +
              //'    content: "";' +
              '    width: auto;' +
              '    height: 2em;' +
              '    left: 0;' +
              '	bottom: -1px;' +
              ' 	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAAcSURBVBhXY/j//z8CMwARiIBxQDRcBkz//88AADkkH+H0w7XRAAAAAElFTkSuQmCC");' +
              '	background-size: 5px;' +
              '}' +
              // Image
              '#chat .chat-container .chat-messages .chat-main li .redub.emote,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote {' +
              '	width: auto;' +
              '	height: 2em;' +
              //' 	max-width: 10em !important;' +
              //' 	max-height: 2em !important;' +
              '	vertical-align: bottom;' +
              '	vertical-align: text-bottom;' +
              '}' +
              // TRIGGERED emote
              '@keyframes triggered {' +
              '	0% { transform: scale(1.05) translate(0, 0); }' +
              '	12.5% { transform: scale(1.05) translate(2.5%, 0); }' +
              '	25% { transform: scale(1.05) translate(0, -2.5%); }' +
              '	37.5% { transform: scale(1.05) translate(2.5%, -2.5%); }' +
              '	50% { transform: scale(1.05) translate(-2.5%, 0); }' +
              '	62.5% { transform: scale(1.05) translate(-2.5%, 2.5%); }' +
              '	75% { transform: scale(1.05) translate(2.5%, 2.5%); }' +
              '	87.5% { transform: scale(1.05) translate(-2.5%, 2.5%); }' +
              '	100% { transform: scale(1.05) translate(2.5%, 0); }' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.emote.triggered,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote.triggered {' +
              '	max-width: 3em !important;' +
              '	max-height: initial !important;' +
              '	display: inline-block;' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.emote.triggered *,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote.triggered * {' +
              '	position: relative;' +
              '	display: block;' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.emote.triggered div.who,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote.triggered div.who {' +
              '	height: 3em;' +
              '	overflow: hidden;' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.emote.triggered div.who img,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote.triggered div.who img {' +
              '	position: absolute;' +
              '	/*animation: triggered .01s cubic-bezier(0, 1.32, 1, -0.05) infinite;*/ animation: triggered .01s cubic-bezier(1, 0, 0, 1) infinite;' +
              '}' +
              '#chat .chat-container .chat-messages .chat-main li .redub.emote.triggered div.who::after,' +
              '#private-messages ul.message-list li.message-item .message-content .redub.emote.triggered div.who::after {' +
              '	content: "";' +
              '	position: absolute;' +
              '	top: 0;' +
              '	left: 0;' +
              '	width: 100%;' +
              '	height: 100%;' +
              '	background-color: rgba(255, 0, 0, 0.14);' +
              '}' +
              'img.redub.emote.hallo{' +
              ' left: 4px;' +//<===================================================================|| Added this
              ' top: -6.5px;' +
              ' position: relative;' +
              '}' +
              'span.redub.hallo.span {' +
              '   width: 0px;' +
              '   height: 0px;' +
              '   position: absolute;' +
              '}' +
              '</style>').appendTo('head');
        }

        var loadFunctions = {
            requestAnyEmote: function(endpoint, callback) {
                var request = new XMLHttpRequest();
                request.open('GET', endpoint);
                request.onreadystatechange = function() {
                    if(request.readyState !== 4)
                        return;
                    if(request.status !== 200)
                        return callback(false);

                    var response = false;
                    try { response = JSON.parse(request.responseText); }
                    catch(x) { console.error(x); }
                    callback(response);
                };
                request.send();
            },
            loadTwitchTVEmotes: function(callback) {
                var twitchtv = { };
                loadFunctions.requestAnyEmote(
                    links.twitchtv_api_endpoint,
                    function(parsedData) {
                        if(parsedData === false)
                            return callback(false);

                        /*
                        	parsedData: {
                         		emoticons: [
                         			{
                         				id: {Number:id},
                         				code: {String:regexp},
                         				emoticon_set: {Number:set, not used}
                         			},
                         			<...>
                         		]
                        	}
                        */
                        parsedData.emoticons.forEach(function(reqEmote) {
                            reqEmote.codeLc = reqEmote.code.toLowerCase();

                            var emoteRegexp = reqEmote.codeLc;
                            var possibleIndex = 0;
                            while(twitchtv[emoteRegexp])
                                emoteRegexp = reqEmote.codeLc + '-' + (++possibleIndex);

                            var emote = { id: reqEmote.id };
                            {
                                if(reqEmote.code !== reqEmote.codeLc || possibleIndex > 0)
                                    emote.originalRegexp = reqEmote.code;
                                emoteRegexp = (function() { // special treatment to TwitchTV Robot, Turbo and Monkey "emojis"
                                    emote.onlyIfGroupSpecified = true;
                                    // since TwitchTV works by ids, it's less probable they will change... If so I'll make sure to update them ;)
                                    switch(reqEmote.id) {
                                            /*  Robot |  Turbo  | Monkey  |      Result     */
                                        case  1: case 440: case 499: return 'happy';
                                        case  2: case 434: case 489: return 'cry';
                                        case  3: case 443: case 496: return 'grin';
                                        case  4: case 432: case 498: return 'angry';
                                        case  5: case 444: /* N/A */ return 'sleepy';
                                        case  6: case 437: case 497: return 'confused';
                                        case  7: case 441: case 500: return 'cool';
                                        case  8: case 436: case 492: return 'surprised';
                                        case  9: case 445: case 483: return 'heart';
                                        case 10: case 443: case 493: return 'unsure';
                                        case 11: case 439: case 501: return 'wink';
                                        case 12: case 438: case 490: return 'tongue';
                                        case 13: case 442: case 491: return 'twink';
                                        case 14: case 435: /* N/A */ return 'pirate';
                                            /*    NOT/AV    */ case 484: return 'hat';
                                            /*    NOT/AV    */ case 485: return 'blind';
                                            /*    NOT/AV    */ case 486: return 'love';
                                            /*    NOT/AV    */ case 487: return 'grounded';
                                            /*    NOT/AV    */ case 488: return 'pipe';
                                            /*    NOT/AV    */ case 494: return 'neutral';
                                            /*    NOT/AV    */ case 495: return 'speechless';
                                            /* ----------------------------------------------- */
                                        default: delete emote.onlyIfGroupSpecified; break;
                                    }
                                    return undefined;
                                })() || emoteRegexp;
                                if(reqEmote.id >= 432 && reqEmote.id <= 445)
                                    emoteRegexp = 'turbo-' + emoteRegexp;
                                else if(reqEmote.id >= 483 && reqEmote.id <= 501)
                                    emoteRegexp = 'monkey-' + emoteRegexp;
                            }
                            twitchtv[emoteRegexp] = emote;
                        });

                        emoteList.twitchtv = twitchtv;
                        callback(true);
                    },
                    'TwitchTV'
                );
            },
            loadBetterTwitchTVEmotes: function(callback) {
                var bettertwitchtv = { };
                loadFunctions.requestAnyEmote(
                    links.bettertwitchtv_api_endpoint,
                    function(parsedData) {
                        if(parsedData === false)
                            return callback(false);

                        /*
							parsedData: {
								status: {Number:request status code},
								urlTemplate: {String:image endpoint, not used since we already have it},
								emotes: [
									{
										id: {String:id},
										code: {String:regexp},
										channel: {String:channel, not used},
										restrictions: {Object:emote restrictions, not used},
										imageType: {String:image type, not used}
									},
									<...>
								]
							}
                        */
                        if(parsedData.status !== 200) // to my understanding shouldn't happend, but it's good to always be sure
                            return callback(false);

                        parsedData.emotes.forEach(function(reqEmote) {
                            reqEmote.codeLc = reqEmote.code.toLowerCase();

                            var emoteRegexp = reqEmote.codeLc;
                            var possibleIndex = 0;
                            while(bettertwitchtv[emoteRegexp])
                                emoteRegexp = reqEmote.codeLc + '-' + (++possibleIndex);

                            var emote = { id: reqEmote.id };
                            {
                                if(reqEmote.code !== reqEmote.codeLc || possibleIndex > 0)
                                    emote.originalRegexp = reqEmote.code;
                                emoteRegexp = emoteRegexp.replace(/^bttv/, function() { // special treatment to BetterTwitchTV "emojis"
                                    emote.onlyIfGroupSpecified = true;
                                    return '';
                                });
                            }
                            bettertwitchtv[emoteRegexp] = emote;
                        });

                        emoteList.bettertwitchtv = bettertwitchtv;
                        callback(true);
                    },
                    'BetterTwitchTV'
                );
            },
            loadTastyCatEmotes: function(callback) {
                var tastycat = { };
                loadFunctions.requestAnyEmote(
                    links.tastycat_api_endpoint,
                    function(parsedData) {
                        if(parsedData === false)
                            return callback(false);

                        /*
                        	parsedData: {
                        		{Object:type, not used}: {
									{String:regexp}: {
                        				height: {Number:height, not used}
                        				url: {String:image url},
                        				width: {Number:width, not used},
                        				hidden: {Boolean:hidden on autocomplete (?), not used, not always present}
                       				},
                        			<...>
                        		}
                        		<...>
                        	}
                        */
                        Object.keys(parsedData).forEach(function(type) {
                            Object.keys(parsedData[type]).forEach(function(code) {
                                var reqEmote = parsedData[type][code];
                                reqEmote.codeLc = code.toLowerCase();

                                var emoteRegexp = reqEmote.codeLc;
                                var possibleIndex = 0;
                                while(tastycat[emoteRegexp])
                                    emoteRegexp = reqEmote.codeLc + '-' + (++possibleIndex);

                                var emote = { imageSrc: reqEmote.url };
                                {
                                    if(code !== reqEmote.codeLc || possibleIndex > 0)
                                        emote.originalRegexp = code;
                                }
                                tastycat[emoteRegexp] = emote;
                            });
                        });

                        emoteList.tastycat = tastycat;
                        callback(true);
                    },
                    'TastyCat'
                );
            },
            loadFrankerFaceZEmotes: function(callback) {
                var frankerfacez = { };
                loadFunctions.requestAnyEmote(
                    links.frankerfacez_api_endpoint,
                    function(parsedData) {
                        if(parsedData === false)
                            return callback(false);

                        /*
                        	parsedData: {
                        		{String:regexp}: {String:id}
                        		<...>
                        	}
                        */
                        Object.keys(parsedData).forEach(function(code) {
                            var codeLc = code.toLowerCase();

                            var emoteRegexp = codeLc;
                            var possibleIndex = 0;
                            while(frankerfacez[emoteRegexp])
                                emoteRegexp = codeLc + '-' + (++possibleIndex);

                            var emote = { id: parsedData[code] };
                            {
                                if(code !== codeLc || possibleIndex > 0)
                                    emote.originalRegexp = code;
                            }
                            frankerfacez[emoteRegexp] = emote;
                        });

                        emoteList.frankerfacez = frankerfacez;
                        console.log("shitisready ", shitisready);
                        shitisready = true;
                        callback(true);
                    },
                    'FrankerFaceZ'
                );
            },
            loadRedubEmotes: function(callback) {
                var redub = { };
                loadFunctions.requestAnyEmote(
                    links.redub_api_endpoint,
                    function(parsedData) {
                        if(parsedData === false)
                            return callback(false);

                        /*
							parsedData: {
								{String:regexp}: {String:image url}
								<...>
							}
						*/
                        Object.keys(parsedData).forEach(function(code) {
                            function setEmote(synonymCode) {
                                var emoteRegexp = synonymCode.toLowerCase();
                                // no need to check if same code is reused since I will make sure it's not.
                                redub[emoteRegexp] = {
                                    imageSrc: parsedData[code],
                                    originalRegexp: synonymCode
                                };
                            }

                            if(code.indexOf('|') > -1)
                                code.split('|').forEach(setEmote);
                            else setEmote(code);
                        });
                        console.log("RedubEmotes",Object.keys(redub).length);
                        emoteList.redub = redub;
                        callback(true);
                    },
                    'Redub'
                );
            },
            finishLoading: function() {
                /* resolve incompatibilities with emojis */ {
                    var emojiShortnames = emojione.shortnames.toLowerCase().substring(1, emojione.shortnames.length - 1);
                    emojiShortnames.split(':|:').forEach(function(emojiCode) {
                        Object.keys(emoteList).forEach(function(emoteGroup) {
                            emoteGroup = emoteList[emoteGroup];
                            if(emoteGroup.hasOwnProperty(emojiCode)) emoteGroup[emojiCode].onlyIfGroupSpecified = true;
                        });
                    });
                }

                /* convert emotes on elements that "were waiting for all emotes to fully load" */ {
                    var awaitingElList = document.querySelectorAll('span.redub.awaiting-emote-convertion');
                    for(var i = 0; i < awaitingElList.length; i++) {
                        var awaitingEl = awaitingElList[i];
                        awaitingEl.parentNode.innerHTML = emojione.toImage(awaitingEl.innerHTML);
                    }
                }
            }
        };
        /* Load emotes */ {
            var onDoneCallback = function() {
                toLoad--;
                loop();
            };
            var loop = function() {
                // in order of higher to lower average load time
                switch(toLoad) {
                    default:
                        break;
                    case 5:
                        loadFunctions.loadRedubEmotes(onDoneCallback);
                        break;
                    case 4:
                        loadFunctions.loadTastyCatEmotes(onDoneCallback);
                        break;
                    case 3:
                        loadFunctions.loadBetterTwitchTVEmotes(onDoneCallback);
                        break;
                    case 2:
                        loadFunctions.loadTwitchTVEmotes(onDoneCallback);
                        break;
                    case 1:
                        loadFunctions.loadRedubEmotes(onDoneCallback);
                        break;
                    case 0:
                        loadFunctions.finishLoading();
                        break;
                }
            };
            loop();
        }

        {
            var originalReplacingFunk = emojione.toImage;
            var newReplacingFunk = function(html) {
                return replaceOnElement(html, originalReplacingFunk.bind(undefined));
            };
            emojione.toImage = newReplacingFunk;
        }
        function getEmoteImage(emoteObj, group, size) {
            size = size || 2;
            switch(group) {
                default:
                    return null;
                case 'twitchtv':
                case 'bettertwitchtv':
                case 'frankerfacez':
                    return links[group + '_image_endpoint'].replace('%id%', emoteObj.id).replace('%size%', size);
                case 'tastycat':
                case 'redub':
                case 'room':
                    return emoteObj.imageSrc;
            }
        }
        function renderTriggered() {
            var userid = Dubtrack.room.chat.model.last().get('user')._id;
            return '<div class="redub emote triggered" title=":redub>TRIGGERED:" data-group="redub" data-regexp="TRIGGERED">' +
                '<div class="who">' +
                '<img draggable="false" src="' + Dubtrack.config.apiUrl + Dubtrack.config.urls.userImage.replace(':id', userid) + '" />' +
                '</div>' +
                '<img draggable="false" src="' + links.triggered_sign_image_endpoint + '" />' +
                '</div>';
        }
        var halloweenemotes = {
            'HalloPirate':'true',
            'HalloKKona':'true', //<====================================================||Added This
            'HalloFedora':'true', 
            'HalloWitch':'true',
            'HalloHorns':'true',
            'HalloHalo':'true',
        };
        // super unoptimized function -- but oh well ¯\_(ツ)_/¯
        function replaceOnElement(html, callback) {
            if(toLoad > 0)
                return '<span class="redub awaiting-emote-convertion">' + html + '</span>';
            //([^\s]+) for a space
            // pretty complex RegExp → avoids ASCII emojis starting with ':'. Explanation at https://regex101.com/r/xB9yZ8/1
            var regexpMatch = html.match(/(?!:. ):.[^ :]+:/gi);
            var toReplace = [];
            if(regexpMatch)
                while(regexpMatch.length > 0) {
                    var emoteMatch = regexpMatch[0];
                    /* find repetitions */ {
                        var repetitionIndex;
                        while((repetitionIndex = regexpMatch.indexOf(emoteMatch)) >= 0) {
                            regexpMatch.splice(repetitionIndex, 1);
                        }
                    }
                    html = html.replace(
                        new RegExp(emoteMatch, 'gi'),
                        function(all) {
                            var selector = all.substring(1, all.length - 1);
                            selector = selector.replace('&gt;', '>');

                            var group, emote;
                            var groupWasSpecified;
                            {
                                var match;
                                if((match = selector.match(/(.[^>]+)>(.[^>]+)/))) {
                                    groupWasSpecified = true;
                                    console.log("emote", emote);
                                    emote = match[2].toLowerCase();
                                    group = match[1].toLowerCase();
                                    var groupRegexpList = Object.keys(groupRegexp);
                                    for(var i = 0; i < groupRegexpList.length; i++) {
                                        var gRegexp = groupRegexpList[i];
                                        if(new RegExp('^(' + gRegexp + ')$').test(group)) {
                                            group = groupRegexp[gRegexp];
                                            break;
                                        }
                                    }
                                } else if((match = selector.match(/(.[^>]+)/))) {
                                    groupWasSpecified = false;
                                    emote = match[1].toLowerCase();
                                    group = false;
                                    var groupList = Object.keys(emoteList);
                                    for(var j = 0; j < groupList.length; j++) {
                                        var emoteGroup = groupList[j];
                                        if(emoteList[emoteGroup][emote]) {
                                            group = emoteGroup;
                                            break;
                                        }
                                    }
                                }
                                if((group === 'redub' || !groupWasSpecified) && emote === 'triggered') {
                                    group = 'redub';
                                    return renderTriggered();
                                }

                                if(!group)
                                    return all;
                            }

                            var groupEmoteList = emoteList[group],
                                emoteObj;
                            if(!groupEmoteList || !(emoteObj = groupEmoteList[emote]))
                                return all;
                            if(emoteObj.onlyIfGroupSpecified && !groupWasSpecified)
                                return all;

                            emoteConvertionsCount++;
                            toReplace.push([ emoteObj, group, all, emote, emoteConvertionsCount ]);

                            return '<span class="redub loading-emote" data-redub-emoteconvnum="' + emoteConvertionsCount + '">' + all + '</span>';
                        }
                    );
                }

            if(toReplace.length <= 0)
                return callback(html);

            toReplace.forEach(function(replaceData, index) {
                var emoteObj = replaceData[0],
                    group = replaceData[1],
                    all = replaceData[2],
                    regexp = replaceData[3],
                    emoteConvertionNumber = replaceData[4];

                var onEvent = function(replaceTo) {
                    emoteImg.onload = undefined;
                    emoteImg.onerror = undefined;

                    var elToReplace = document.querySelector('span[data-redub-emoteconvnum="' + emoteConvertionNumber + '"]');
                    if(!elToReplace) return;
                    /* Special treatment for Room Chat messages *//* {
						htmlFinal = htmlFinal.replace(new RegExp(all, 'gi'), replaceTo);
						if(index !== toReplace.length - 1) return;
						var parentEl = elToReplace, isRoomChatMessage = false;
						while((parentEl = parentEl.parentElement))
							isRoomChatMessage = parentEl.tagName !== 'LI' && parentEl.parentElement && parentEl.parentElement.className !== 'chat-main';
						if(!isRoomChatMessage) return;
						parentEl.className.match(/chat-id-(.[^ ]+)/g).slice(1).forEach(function(className) {
							var chatModel = Dubtrack.room.chat.model.findWhere({ chatid: className.replace('chat-id-', '') });
							if(!chatModel) return;
							chatModel.set('messageConverted', htmlFinal);
						});
					}*/
                    elToReplace.outerHTML = replaceTo;
                };

                var emoteImg = new Image();
                if(halloweenemotes[emoteObj.originalRegexp]==='true'){

                    console.log("renderingemote",renderHalloween(emoteImg));
                    emoteImg.onload = function(){//renderHalloween(emoteObj, group, regexp);
                        onEvent('<span class="redub hallo span"title=":redub>'+(emoteObj.originalRegexp || regexp) + '">'+
                            '<img' +
                            ' class="redub emote hallo"' +
                            ' title=":' + group + '>' + (emoteObj.originalRegexp || regexp) + ':"' +
                            ' src="' + emoteImg.src + '"' +
                            ' data-group="' + group + '"' +
                            ' data-regexp="' + (emoteObj.originalRegexp || regexp) + '"' +//<=========================================================||Added This
                            ' /></span>');
                    };
                }
                else{
                    emoteImg.onload = function() {
                        onEvent(
                            '<img' +
                            ' class="redub emote"' +
                            ' title=":' + group + '>' + (emoteObj.originalRegexp || regexp) + ':"' +
                            ' src="' + emoteImg.src + '"' +
                            ' data-group="' + group + '"' +
                            ' data-regexp="' + (emoteObj.originalRegexp || regexp) + '"' +
                            ' />'
                        );
                    };
                }
                emoteImg.onerror = function() {
                    if(group === 'frankerfacez' && !emoteObj.useByOneVersion) {
                        emoteObj.useByOneVersion = true;
                        emoteImg.src = getEmoteImage(emoteObj, group, 1);
                        return;
                    }
                    if(group === 'bettertwitchtv' && !emoteObj.useByOneVersion) {
                        emoteObj.useByOneVersion = true;
                        emoteImg.src = getEmoteImage(emoteObj, group, 3);
                        return;
                    }
                    onEvent(
                        '<span' +
                        ' class="redub error-emote"' +
                        ' title="Failed to load emote image"' +
                        '>' + all + '</span>'
                    );
                };
                emoteImg.src = getEmoteImage(emoteObj, group, emoteObj.useByOneVersion ? 1 : 2);


                return emoteImg;
            });

            return callback(html);
        }

    }

    var bootInterval = setInterval(function() {
        if(checkIfReDub())
            return clearInterval(bootInterval);

        if(typeof Dubtrack !== 'undefined' && document.readyState === 'complete') {
            if(!Dubtrack.helpers.cookie.get('dubtrack-room-id'))
                return clearInterval(bootInterval);

            if(typeof emojione === 'undefined')
                return;

            new GiveDemEmotes();
            clearInterval(bootInterval);
        }
    }, 500);
})();