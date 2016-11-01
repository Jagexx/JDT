// ==UserScript==
// @name         Jetman640s Dubtrack Tools™
// @version      1.0
// @description  try to take over the world!
// @author       Jetman640
// @contact		 Dubtrack → Jetman640 | GitHub → Jetman640
// @run-at		 document-idle
// @match        https://*.dubtrack.fm/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    //add ETA, Last Played, and Next Q Display into header
    //add play my own list
    //maybe DTA style pets

    var jetman640stools;
    function Jetman640sToolScript(){
        jetman640stools = {
            debug:false,
            states:{},
            switches: false,
            elements: false,
            functions: false,
            openelements: [],
        };
        //===========================================//
        //--------------Options List-----------------//
        //===========================================//
        jetman640stools.switches = {//switch types: select, input, bool, none
            cleanchat: { setting:"cleanchat", settingtype:"select", title:"Max Messages (0 is off)", defaultvalue:250, currentvalue:250, options:[0,50,100,150,200,350,500,1000] },
            etacheck: { setting:"etacheck", settingtype:"bool", title:"Display Your Q Info", defaultvalue:false, currentvalue:false, options:[0,50,100,150,200,350,500,1000] },
            //scaledubtrack: { setting:"scaledubtrack", settingtype:"select", title:"Dubtrack Scale", defaultvalue:1.0, currentvalue:1.0, options:[0.25,0.50,0.75,1.0,1.25,1.5,1.75,2] },
            //somerandominput: { setting:"somerandominput", settingtype:"input", title:"Some Text Input", defaultvalue:"somerandomtext", currentvalue:"somerandomtext", options:[] },
            //onoffswitch: { setting:"onoffswitch", settingtype:"bool", title:"An On Off Switch For Testing", defaultvalue:false, currentvalue:false, options:[] },
        };
        jetman640stools.functions = {
            //===========================================//
            //-------------Option Functions--------------//
            //===========================================//
            etacheck:function(){
                if(jetman640stools.debug)
                {
                    console.log("Object.keys(jetman640stools.states).includes(etacheck)",Object.keys(jetman640stools.states).includes("etacheck"));
                    console.log("jetman640stools.switches.etacheck.currentvalue === true",jetman640stools.switches.etacheck.currentvalue === true);
                    console.log('document.getElementsByClassName("yourqinfo").length < 1',0 <document.getElementsByClassName("yourqinfo").length );
                }
                if(Object.keys(jetman640stools.states).includes("etacheck")&&
                   jetman640stools.switches.etacheck.currentvalue === true)
                {
                    
                }
                else
                {
                    if(jetman640stools.switches.etacheck.currentvalue ===true)
                    {
                        //add the tool
                        var qinfowraperdiv = document.createElement("div");
                        qinfowraperdiv.className = "yourqinfo";
                        qinfowraperdiv.innerHTML = ''+
                            '<span class="yoursongimg">'+
                            '<img src="http://i1.ytimg.com/vi/tEPB7uzKuh4/hqdefault.jpg">'+
                            '</span><div class="leftinfo">'+
                            '<span>'+
                            '<a><b>Pendulum "Watercolour"</b></a>'+
                            '</span>'+
                            '</div>'+
                            '<div class="rightinfo">'+
                            '<div>'+
                            '<b>Last Played</b><span> 5</span>:<span>23</span>:<span>23</span>'+
                            '</div>'+
                            '<div>'+
                            '<b>Length </b><i>03</i>:<i>33</i>'+
                            '</div>'+
                            '</div>';
                        document.getElementById("header-global").appendChild(qinfowraperdiv);
                        jetman640stools.states["etacheck"] = qinfowraperdiv;
                    }
                    else
                    {
                        //check to see if the tool exists... then remove
                        if(0<document.getElementsByClassName("yourqinfo").length)
                        {
                            document.getElementById("header-global").removeChild(document.getElementsByClassName("yourqinfo")[0]);
                            delete jetman640stools.states.etacheck;
                        }
                    }
                }
            },
            cleanchat: function(){
                //if(jetman640stools.states.cleanchat.running === 'true')
                if(Object.keys(jetman640stools.states).includes('cleanchat'))
                {
                    //we are running the interval once just to give the page time for initial boot up
                    if(jetman640stools.switches.cleanchat.currentvalue === 0)
                    {
                        clearInterval(jetman640stools.states.cleanchat.interval);
                        jetman640stools.states.cleanchat.elements = false;
                        return;
                    }
                    else if (jetman640stools.states.cleanchat.elements === 'false')
                    {
                        if(document.getElementsByClassName("chat-main").length <=0)
                        {
                            return;
                        }
                        jetman640stools.states.cleanchat.elements ={
                            chatroom:document.getElementsByClassName("chat-main")[0],
                            //chatroommessagecontainer:document.getElementsByClassName("chat-main")[0].getElementsByTagName("ul")
                        };
                    }
                    //ok now we can clean chat
                    var chatmessagecontainer = jetman640stools.states.cleanchat.elements.chatroom;
                    var chatMessages = chatmessagecontainer.getElementsByTagName("li");
                    //return;
                    if(jetman640stools.debug)
                    {
                        //console.log("Chat Message Count",chatMessages.length);
                    }
                    if(chatMessages.length < jetman640stools.switches.cleanchat.currentvalue){
                        return;
                    }
                    else
                    {
                        while(jetman640stools.switches.cleanchat.currentvalue < chatmessagecontainer.getElementsByTagName("li").length)
                        {
                            if(jetman640stools.debug)
                            {
                                //console.log("removing message 1 of",chatMessages.length);
                            }
                            var messageInfo = chatMessages[0].getBoundingClientRect();
                            //console.log("Message Height", messageInfo.height);
                            chatmessagecontainer.removeChild(chatMessages[0]);
                            //ok now lets auto scroll this bitch so we dont anex the chat to neverland
                            if(messageInfo.height <= parseInt(document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top, 10))
                            {
                                //WARNING! long mf line of code incoming...
                                //but basicaly it changes the top value in the style attribute for the scroll bar
                                //reducing it by the height of the message... not sure if I should do it like this but you know FCK IT!
                                document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top = (parseInt(document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top, 10) - messageInfo.height)+"px";
                            }
                            //chatMessages.shift();
                        }
                    }
                }
                else
                {
                    if(jetman640stools.debug)
                    {
                        //console.log("initializing clean chat",jetman640stools.switches.cleanchat.currentvalue);
                    }
                    jetman640stools.states['cleanchat'] ={
                        running:'true',
                        interval:setInterval(jetman640stools.functions.cleanchat, 5000),
                        elements:'false',
                    };
                }
            },
            scaledubtrack: function(){

                if(jetman640stools.debug)
                {
                    console.log("setting html.style.zoom", jetman640stools.switches.scaledubtrack.currentvalue);
                    console.log("setting backstretch.style.zoom", 1.0/jetman640stools.switches.scaledubtrack.currentvalue);
                }
                document.getElementsByTagName("html")[0].style.zoom = jetman640stools.switches.scaledubtrack.currentvalue;
                document.getElementsByClassName("backstretch")[0].style.zoom = 1.0/jetman640stools.switches.scaledubtrack.currentvalue;
            },
            //===========================================//
            //------Menu functions and Constructor-------//
            //===========================================//
            toggledebug:function(){
                jetman640stools.debug = !jetman640stools.debug;
                localStorage.setItem("jetman640stoolsdebug", jetman640stools.debug);
            },
            optionchange:function(e){//this is called whenever and option changes, and is used to call functions asociated with the option
                if(jetman640stools.debug){
                    console.log("optionchange e", e);
                    console.log("optionchange e.target.id", e.target.id);
                    console.log("optionchange jetman640stools.switches[e.target.id]", jetman640stools.switches[e.target.id]);
                }
                var cs = jetman640stools.switches[e.target.id];
                if(jetman640stools.debug)
                {
                    console.log("jetman640stools.switches[e.target.id]",cs);
                }
                switch (cs.settingtype)
                {
                    case "select":
                        if(jetman640stools.debug){// e.options[e.selectedIndex].value;
                            console.log("e.target.selectedIndex",e.target.selectedIndex);
                            console.log("e.target.options[e.target.selectedIndex]",e.target.options[e.target.selectedIndex]);
                            console.log("e.target.options[e.target.selectedIndex].value",e.target.options[e.target.selectedIndex].value);
                        }
                        cs.currentvalue = e.target.options[e.target.selectedIndex].value;
                        localStorage.setItem(cs.setting, JSON.stringify(cs));

                        break;
                    case "input":

                        break;
                    case "bool":
                        if(jetman640stools.debug)
                        {
                            console.log("cs.currentvalue",cs.currentvalue);
                            console.log('document.getElementById("'+cs.setting+'checkbox").checked', document.getElementById(cs.setting+"checkbox").checked);
                        }
                        cs.currentvalue = (cs.currentvalue === true|| cs.currentvalue ==='true')? false: true;
                        document.getElementById(cs.setting+"checkbox").checked =(cs.currentvalue === true|| cs.currentvalue ==='true')? true: false;
                        localStorage.setItem(cs.setting, JSON.stringify(cs));

                        break;
                    case'none':
                        break;
                }
                //finally run the function accociated with the switch
                if(jetman640stools.debug)
                {
                    console.log("trying to start function", cs.setting);
                }
                if(Object.keys(jetman640stools.functions).includes(cs.setting))
                {
                    jetman640stools.functions[cs.setting]();
                }
            },
            showoptions:function(e){
                if(jetman640stools.openelements.includes("jetman640ssettingsdiv")){return;}
                jetman640stools.elements.jetman640ssettingsdiv.style = 'display: -webkit-box; transform: translateX(-550px);';
                //$( "#jetman640ssettingsdiv" ).click(function( event ) {event.stopPropagation();});
                //jetman640stools.elements.jetman640ssettingsdiv.onclick=jetman640stools.functions.stopprop(e);
                //jetman640stools.openelements["jetman640ssettingsdiv"] = {name:"jetman640ssettingsdiv"};
                jetman640stools.openelements.push("jetman640ssettingsdiv");
                if(jetman640stools.debug)
                {
                    console.log("openelements",jetman640stools.openelements);
                }
                jetman640stools.functions.stopprop(e);
            },
            stopprop:function(event){
                event.stopPropagation();
            },
            clickaway:function(e){
                var retainer = [];
                jetman640stools.openelements.forEach(function(element){
                    if(jetman640stools.debug)
                    {
                        console.log("element", element);
                        console.log("jetman640stools.elements[element]",jetman640stools.elements[element]);
                        console.log("e",e);
                        console.log("$(jetman640stools.elements[element]).parents(e.target)", $(e.target).parents("#"+element).length);
                    }
                    if(e.target == jetman640stools.elements[element] ||
                       $(e.target).parents("#"+element).length >0)
                    {
                        retainer.push(element);
                    }
                    else
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("click away forEach element =",element);
                            console.log("e",e);
                        }
                        jetman640stools.elements[element].style = "display:none;";
                    }
                });
                jetman640stools.openelements = retainer;
            },
            initialize:function(){
                var torun=[];
                jetman640stools.elements = {};
                var jetman640stoolsdiv = document.createElement("div");
                jetman640stoolsdiv.id = "jetman640stools";
                //jetman640stoolsdiv.innerHTML = '<span class="jetman640stoolsiconspan">' + Dubtrack.session.get('username')+ ' Settings</span>';
                jetman640stoolsdiv.innerHTML = '<span class="jetman640stoolsiconspan">Settings</span>';
                //jetman640stoolsdiv.onclick = jetman640stools.functions.showoptions;
                //jetman640stoolsdiv.innerHTML = '<img src="" alt="'+Dubtrack.session.get('username')+'" title="'+Dubtrack.session.get('username')+' Settings" class="cursor-pointer" style="filter: drop-shadow(rgba(2, 51, 86, 0.34902) 15px 1px 3px);">';
                //jetman640stoolsdiv.appendChild('<img src="" alt="'+Dubtrack.session.get('username')+'" title="'+Dubtrack.session.get('username')+' Settings" class="cursor-pointer" style="filter: drop-shadow(rgba(2, 51, 86, 0.34902) 15px 1px 3px);">');
                var jetman640ssettingsdiv = document.createElement("div");
                jetman640ssettingsdiv.id = "jetman640ssettingsdiv";
                jetman640ssettingsdiv.style ="display:none;";
                var settingsul = document.createElement("ul");

                var switchkeys = Object.keys(jetman640stools.switches);
                var toload = switchkeys.length-1;
                var loopCallback = function(){
                    toload--;
                    if(toload<0)
                    {
                        return false;
                    }
                    loop(loopCallback);
                };
                var loop = function(callback){
                    if(jetman640stools.debug)
                    {
                        console.log("switchkeys[toload]", switchkeys[toload]);
                        console.log("toload",toload);
                    }
                    var switchkey = switchkeys[toload];
                    var settingli = document.createElement("li");
                    var curset = jetman640stools.switches[switchkey];
                    if(localStorage.getItem(switchkey)===null ||
                       localStorage.getItem(switchkey) ==="[object Object]")
                    {
                        //remember to do some null checks because there will be a few
                        if(jetman640stools.debug)
                        {
                            console.log("initializing setting", toload);
                            console.log(switchkey, curset);
                        }
                        localStorage.setItem(switchkey, JSON.stringify(curset));
                    }
                    else
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("loading setting", toload);
                            console.log(switchkey, JSON.parse(localStorage.getItem(switchkey)));
                        }
                        jetman640stools.switches[switchkey].currentvalue = JSON.parse(localStorage.getItem(switchkey)).currentvalue;
                    }
                    if(jetman640stools.debug)
                    {
                        console.log("switchkey", switchkey);
                        console.log("switchkey out", jetman640stools.switches[switchkey]);
                        console.log("settingtype",curset.settingtype);
                    }
                    switch(curset.settingtype)
                    {
                        case "select"://add a select tag
                            var nsel = document.createElement("select");
                            nsel.id = curset.setting;
                            nsel.onchange = jetman640stools.functions.optionchange;
                            settingli.innerHTML = '<lable>'+curset.title+'</lable>';
                            //for(var i = curset.minvalue; i < curset.maxvalue; i = i + curset.stepsize)
                            for(var i in curset.options)
                            {
                                var selected = (curset.currentvalue==curset.options[i])?true:false;
                                var noel = document.createElement("option");
                                noel.value = curset.options[i];
                                noel.innerHTML = curset.options[i];
                                noel.selected = selected;
                                nsel.appendChild(noel);
                                /*
                                if(i<curset.defaultvalue&&(i+curset.stepsize)>curset.defaultvalue)
                                {
                                    //add in a default select value
                                    var noel2 = document.createElement("option");
                                    noel2.value = i;
                                    noel2.innerHTML = i;
                                    noel2.selected = true;
                                    nsel.appendChild(noel2);
                                }*/
                            }
                            jetman640stools.elements[curset.setting] = nsel;
                            settingli.appendChild(nsel);
                            settingsul.appendChild(settingli);
                            break;
                        case "input"://add an input tag
                            break;
                        case "bool"://add a switch/checkbox
                            /*<lable>Display Your Q Info</lable>
                              <span class="switch">
                              <input type="checkbox">
                              <div class="slider" id="etacheck">
                              </div>
                              </span>*/
                            settingli.innerHTML ='<lable>'+curset.title+'</lable>';
                            var nswt = document.createElement("span");
                            var ncb = document.createElement("input");
                            var ndv = document.createElement("div");
                            ndv.id = curset.setting;
                            nswt.className = "switch";
                            ncb.type ="checkbox";
                            ncb.id= curset.setting+"checkbox";
                            ncb.checked = (curset.currentvalue === true|| curset.currentvalue ==='true')? true: false;
                            ndv.className ="slider";
                            ndv.onclick = jetman640stools.functions.optionchange;
                            nswt.appendChild(ncb);
                            nswt.appendChild(ndv);
                            settingli.appendChild(nswt);
                            settingsul.appendChild(settingli);
                            break;
                        case 'none'://just add a first call
                            break;
                    }
                    torun.push(switchkey);
                    callback();
                };
                loop(loopCallback);
                jetman640ssettingsdiv.appendChild(settingsul);
                {
                    //$('<link id="jetman640stoolsstyles" rel="stylesheet" type="text/css" href="raw.githubusercontent.com/Jetman640/Junk/master/Jetman640stools.css">').appendTo('head');
                    //$('<style></style>').load('raw.githubusercontent.com/Jetman640/Junk/master/Jetman640stools.css').appendTo('head');scrrew you cross domain bs
                    $('<style id="jetman640stoolsstyles">' +
                      '#jetman640stools img {' +
                      '/* bottom: -1.4rem; */' +
                      '/* bottom: 0px; */' +
                      'position: relative;' +
                      '/* top: 0; */' +
                      '/* width: 3.4rem; */' +
                      '/* height: 3.4rem; */' +
                      'display: inline;' +
                      'cursor: pointer;' +
                      'vertical-align: top;' +
                      '}' +
                      '#jetman640stools span {' +
                      'cursor: pointer;' +
                      'vertical-align: middle;' +
                      '}' +
                      '#jetman640ssettingsdiv {' +
                      'position: fixed;' +
                      'padding: 0;' +
                      'margin: 0;' +
                      'display: -webkit-box;' +
                      'height: 150px;' +
                      'z-index:9000;' +
                      'width: 25rem;' +
                      'overflow-y: scroll;' +
                      'right: -550px;' +
                      'top: 3.7rem;' +
                      'background: rgba(64, 65, 86, 0.25);' +
                      'box-shadow: 0px 0px 0px 2px rgba(48, 51, 74, 0.25);' +
                      'border-left: 2px;' +
                      'border-bottom: 2px;'+
                      'border-style: outset;' +
                      'border-color: rgba(212, 229, 243, 0.35);' +
                      'backdrop-filter: blur(3px);' +
                      '}' +
                      '#jetman640stools {' +
                      'position: relative;' +
                      'display: inline-block;' +
                      'backdrop-filter: blur(0px);' +
                      '}' +
                      '#jetman640ssettingsdiv ul {' +
                      'width: 100%;' +
                      'height: auto;' +
                      'display: list-item;' +
                      'text-align: right;' +
                      'position: relative;' +
                      '/* margin-right: 0; */' +
                      '/* margin-left: auto; */' +
                      '}' +
                      '#jetman640ssettingsdiv li {' +
                      '/* padding: 3.5rem; */' +
                      'width: 100%;' +
                      'height: 100%;' +
                      '/* margin: 0; */' +
                      'padding-top: 10px;' +
                      'padding-right: 15px;' +
                      'padding-left: 15px;' +
                      'padding-bottom: 0;' +
                      '}' +
                      '#jetman640ssettingsdiv select {' +
                      'width: 100px;' +
                      'height: auto;' +
                      'padding: 5px;' +
                      'background: rgba(64, 65, 86, 0.25);' +
                      'display: inline-block;' +
                      'right: 0;' +
                      'position: relative;' +
                      'text-align: -webkit-right;' +
                      '}</style>').appendTo('head');
                }
                document.body.appendChild(jetman640ssettingsdiv);
                //jetman640stoolsdiv.appendChild(jetman640ssettingsdiv);
                localStorage.jetman640settings = true;//header-right-navigation
                var headerrightnavigation = document.getElementsByClassName("header-right-navigation")[0];
                headerrightnavigation.insertBefore(jetman640stoolsdiv, headerrightnavigation.firstChild.nextSibling);
                jetman640stools.elements["jetman640stoolsdiv"] = jetman640stoolsdiv;
                jetman640stools.elements["jetman640ssettingsdiv"] = jetman640ssettingsdiv;
                jetman640stoolsdiv.onclick = jetman640stools.functions.showoptions;
                $(document).click(jetman640stools.functions.clickaway);
                for(var runcommand in torun)
                {
                    if(jetman640stools.debug)
                    {
                        console.log("checking for a functions for first run", torun[runcommand]);
                    }
                    if(Object.keys(jetman640stools.functions).includes(torun[runcommand]))
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("first time run for command", torun[runcommand]);
                        }
                        jetman640stools.functions[torun[runcommand]]();
                    }
                }
            },
        };
        if(localStorage.getItem("jetman640stoolsdebug") === 'true')
        {
            //localStorage.setItem("jetman640stoolsdebug", jetman640stools.debug);
            jetman640stools.debug = true;
            console.log(jetman640stools.debug, localStorage.getItem("jetman640stoolsdebug"));
        }
        jetman640stools.functions.initialize();
        if(jetman640stools.debug)
        {
            console.log("JetMan640sTools", jetman640stools);
        }
        unsafeWindow.jetman640stools = jetman640stools;
    }
    if(!jetman640stools && Dubtrack.session.id){
        new Jetman640sToolScript();
    }
    else
    {
        var retry = setInterval(function(){
            if(!jetman640stools && Dubtrack.session.id){
                new Jetman640sToolScript();
            }
            else
            {
                //here is where we do some error report
                console.log("error", "unable to launch jetman640stools");
            }
            clearInterval(retry);
        }, 1000);
    }
    // Your code here...
})();// ==UserScript==
// @name         Jetman640s Dubtrack Tools™
// @version      1.0
// @description  try to take over the world!
// @author       Jetman640
// @contact		 Dubtrack → Jetman640 | GitHub → Jetman640
// @run-at		 document-idle
// @match        https://*.dubtrack.fm/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    //add ETA, Last Played, and Next Q Display into header
    //add play my own list
    //maybe DTA style pets

    var jetman640stools;
    function Jetman640sToolScript(){
        jetman640stools = {
            debug:false,
            states:{},
            switches: false,
            elements: false,
            functions: false,
            openelements: [],
        };
        //===========================================//
        //--------------Options List-----------------//
        //===========================================//
        jetman640stools.switches = {//switch types: select, input, bool, none
            cleanchat: { setting:"cleanchat", settingtype:"select", title:"Max Messages (0 is off)", defaultvalue:250, currentvalue:250, options:[0,50,100,150,200,350,500,1000] },
            etacheck: { setting:"etacheck", settingtype:"bool", title:"Display Your Q Info", defaultvalue:false, currentvalue:false, options:[0,50,100,150,200,350,500,1000] },
            //scaledubtrack: { setting:"scaledubtrack", settingtype:"select", title:"Dubtrack Scale", defaultvalue:1.0, currentvalue:1.0, options:[0.25,0.50,0.75,1.0,1.25,1.5,1.75,2] },
            //somerandominput: { setting:"somerandominput", settingtype:"input", title:"Some Text Input", defaultvalue:"somerandomtext", currentvalue:"somerandomtext", options:[] },
            //onoffswitch: { setting:"onoffswitch", settingtype:"bool", title:"An On Off Switch For Testing", defaultvalue:false, currentvalue:false, options:[] },
        };
        jetman640stools.functions = {
            //===========================================//
            //-------------Option Functions--------------//
            //===========================================//
            etacheck:function(){
                if(jetman640stools.debug)
                {
                    console.log("Object.keys(jetman640stools.states).includes(etacheck)",Object.keys(jetman640stools.states).includes("etacheck"));
                    console.log("jetman640stools.switches.etacheck.currentvalue === true",jetman640stools.switches.etacheck.currentvalue === true);
                    console.log('document.getElementsByClassName("yourqinfo").length < 1',0 <document.getElementsByClassName("yourqinfo").length );
                }
                if(Object.keys(jetman640stools.states).includes("etacheck")&&
                   jetman640stools.switches.etacheck.currentvalue === true)
                {
                    
                }
                else
                {
                    if(jetman640stools.switches.etacheck.currentvalue ===true)
                    {
                        //add the tool
                        var qinfowraperdiv = document.createElement("div");
                        qinfowraperdiv.className = "yourqinfo";
                        qinfowraperdiv.innerHTML = ''+
                            '<span class="yoursongimg">'+
                            '<img src="http://i1.ytimg.com/vi/tEPB7uzKuh4/hqdefault.jpg">'+
                            '</span><div class="leftinfo">'+
                            '<span>'+
                            '<a><b>Pendulum "Watercolour"</b></a>'+
                            '</span>'+
                            '</div>'+
                            '<div class="rightinfo">'+
                            '<div>'+
                            '<b>Last Played</b><span> 5</span>:<span>23</span>:<span>23</span>'+
                            '</div>'+
                            '<div>'+
                            '<b>Length </b><i>03</i>:<i>33</i>'+
                            '</div>'+
                            '</div>';
                        document.getElementById("header-global").appendChild(qinfowraperdiv);
                        jetman640stools.states["etacheck"] = qinfowraperdiv;
                    }
                    else
                    {
                        //check to see if the tool exists... then remove
                        if(0<document.getElementsByClassName("yourqinfo").length)
                        {
                            document.getElementById("header-global").removeChild(document.getElementsByClassName("yourqinfo")[0]);
                            delete jetman640stools.states.etacheck;
                        }
                    }
                }
            },
            cleanchat: function(){
                //if(jetman640stools.states.cleanchat.running === 'true')
                if(Object.keys(jetman640stools.states).includes('cleanchat'))
                {
                    //we are running the interval once just to give the page time for initial boot up
                    if(jetman640stools.switches.cleanchat.currentvalue === 0)
                    {
                        clearInterval(jetman640stools.states.cleanchat.interval);
                        jetman640stools.states.cleanchat.elements = false;
                        return;
                    }
                    else if (jetman640stools.states.cleanchat.elements === 'false')
                    {
                        if(document.getElementsByClassName("chat-main").length <=0)
                        {
                            return;
                        }
                        jetman640stools.states.cleanchat.elements ={
                            chatroom:document.getElementsByClassName("chat-main")[0],
                            //chatroommessagecontainer:document.getElementsByClassName("chat-main")[0].getElementsByTagName("ul")
                        };
                    }
                    //ok now we can clean chat
                    var chatmessagecontainer = jetman640stools.states.cleanchat.elements.chatroom;
                    var chatMessages = chatmessagecontainer.getElementsByTagName("li");
                    //return;
                    if(jetman640stools.debug)
                    {
                        //console.log("Chat Message Count",chatMessages.length);
                    }
                    if(chatMessages.length < jetman640stools.switches.cleanchat.currentvalue){
                        return;
                    }
                    else
                    {
                        while(jetman640stools.switches.cleanchat.currentvalue < chatmessagecontainer.getElementsByTagName("li").length)
                        {
                            if(jetman640stools.debug)
                            {
                                //console.log("removing message 1 of",chatMessages.length);
                            }
                            var messageInfo = chatMessages[0].getBoundingClientRect();
                            //console.log("Message Height", messageInfo.height);
                            chatmessagecontainer.removeChild(chatMessages[0]);
                            //ok now lets auto scroll this bitch so we dont anex the chat to neverland
                            if(messageInfo.height <= parseInt(document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top, 10))
                            {
                                //WARNING! long mf line of code incoming...
                                //but basicaly it changes the top value in the style attribute for the scroll bar
                                //reducing it by the height of the message... not sure if I should do it like this but you know FCK IT!
                                document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top = (parseInt(document.getElementsByClassName("chat-container")[0].getElementsByClassName("ps-scrollbar-y-rail")[0].style.top, 10) - messageInfo.height)+"px";
                            }
                            //chatMessages.shift();
                        }
                    }
                }
                else
                {
                    if(jetman640stools.debug)
                    {
                        //console.log("initializing clean chat",jetman640stools.switches.cleanchat.currentvalue);
                    }
                    jetman640stools.states['cleanchat'] ={
                        running:'true',
                        interval:setInterval(jetman640stools.functions.cleanchat, 5000),
                        elements:'false',
                    };
                }
            },
            scaledubtrack: function(){

                if(jetman640stools.debug)
                {
                    console.log("setting html.style.zoom", jetman640stools.switches.scaledubtrack.currentvalue);
                    console.log("setting backstretch.style.zoom", 1.0/jetman640stools.switches.scaledubtrack.currentvalue);
                }
                document.getElementsByTagName("html")[0].style.zoom = jetman640stools.switches.scaledubtrack.currentvalue;
                document.getElementsByClassName("backstretch")[0].style.zoom = 1.0/jetman640stools.switches.scaledubtrack.currentvalue;
            },
            //===========================================//
            //------Menu functions and Constructor-------//
            //===========================================//
            toggledebug:function(){
                jetman640stools.debug = !jetman640stools.debug;
                localStorage.setItem("jetman640stoolsdebug", jetman640stools.debug);
            },
            optionchange:function(e){//this is called whenever and option changes, and is used to call functions asociated with the option
                if(jetman640stools.debug){
                    console.log("optionchange e", e);
                    console.log("optionchange e.target.id", e.target.id);
                    console.log("optionchange jetman640stools.switches[e.target.id]", jetman640stools.switches[e.target.id]);
                }
                var cs = jetman640stools.switches[e.target.id];
                if(jetman640stools.debug)
                {
                    console.log("jetman640stools.switches[e.target.id]",cs);
                }
                switch (cs.settingtype)
                {
                    case "select":
                        if(jetman640stools.debug){// e.options[e.selectedIndex].value;
                            console.log("e.target.selectedIndex",e.target.selectedIndex);
                            console.log("e.target.options[e.target.selectedIndex]",e.target.options[e.target.selectedIndex]);
                            console.log("e.target.options[e.target.selectedIndex].value",e.target.options[e.target.selectedIndex].value);
                        }
                        cs.currentvalue = e.target.options[e.target.selectedIndex].value;
                        localStorage.setItem(cs.setting, JSON.stringify(cs));

                        break;
                    case "input":

                        break;
                    case "bool":
                        if(jetman640stools.debug)
                        {
                            console.log("cs.currentvalue",cs.currentvalue);
                            console.log('document.getElementById("'+cs.setting+'checkbox").checked', document.getElementById(cs.setting+"checkbox").checked);
                        }
                        cs.currentvalue = (cs.currentvalue === true|| cs.currentvalue ==='true')? false: true;
                        document.getElementById(cs.setting+"checkbox").checked =(cs.currentvalue === true|| cs.currentvalue ==='true')? true: false;
                        localStorage.setItem(cs.setting, JSON.stringify(cs));

                        break;
                    case'none':
                        break;
                }
                //finally run the function accociated with the switch
                if(jetman640stools.debug)
                {
                    console.log("trying to start function", cs.setting);
                }
                if(Object.keys(jetman640stools.functions).includes(cs.setting))
                {
                    jetman640stools.functions[cs.setting]();
                }
            },
            showoptions:function(e){
                if(jetman640stools.openelements.includes("jetman640ssettingsdiv")){return;}
                jetman640stools.elements.jetman640ssettingsdiv.style = 'display: -webkit-box; transform: translateX(-550px);';
                //$( "#jetman640ssettingsdiv" ).click(function( event ) {event.stopPropagation();});
                //jetman640stools.elements.jetman640ssettingsdiv.onclick=jetman640stools.functions.stopprop(e);
                //jetman640stools.openelements["jetman640ssettingsdiv"] = {name:"jetman640ssettingsdiv"};
                jetman640stools.openelements.push("jetman640ssettingsdiv");
                if(jetman640stools.debug)
                {
                    console.log("openelements",jetman640stools.openelements);
                }
                jetman640stools.functions.stopprop(e);
            },
            stopprop:function(event){
                event.stopPropagation();
            },
            clickaway:function(e){
                var retainer = [];
                jetman640stools.openelements.forEach(function(element){
                    if(jetman640stools.debug)
                    {
                        console.log("element", element);
                        console.log("jetman640stools.elements[element]",jetman640stools.elements[element]);
                        console.log("e",e);
                        console.log("$(jetman640stools.elements[element]).parents(e.target)", $(e.target).parents("#"+element).length);
                    }
                    if(e.target == jetman640stools.elements[element] ||
                       $(e.target).parents("#"+element).length >0)
                    {
                        retainer.push(element);
                    }
                    else
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("click away forEach element =",element);
                            console.log("e",e);
                        }
                        jetman640stools.elements[element].style = "display:none;";
                    }
                });
                jetman640stools.openelements = retainer;
            },
            initialize:function(){
                var torun=[];
                jetman640stools.elements = {};
                var jetman640stoolsdiv = document.createElement("div");
                jetman640stoolsdiv.id = "jetman640stools";
                //jetman640stoolsdiv.innerHTML = '<span class="jetman640stoolsiconspan">' + Dubtrack.session.get('username')+ ' Settings</span>';
                jetman640stoolsdiv.innerHTML = '<span class="jetman640stoolsiconspan">Settings</span>';
                //jetman640stoolsdiv.onclick = jetman640stools.functions.showoptions;
                //jetman640stoolsdiv.innerHTML = '<img src="" alt="'+Dubtrack.session.get('username')+'" title="'+Dubtrack.session.get('username')+' Settings" class="cursor-pointer" style="filter: drop-shadow(rgba(2, 51, 86, 0.34902) 15px 1px 3px);">';
                //jetman640stoolsdiv.appendChild('<img src="" alt="'+Dubtrack.session.get('username')+'" title="'+Dubtrack.session.get('username')+' Settings" class="cursor-pointer" style="filter: drop-shadow(rgba(2, 51, 86, 0.34902) 15px 1px 3px);">');
                var jetman640ssettingsdiv = document.createElement("div");
                jetman640ssettingsdiv.id = "jetman640ssettingsdiv";
                jetman640ssettingsdiv.style ="display:none;";
                var settingsul = document.createElement("ul");

                var switchkeys = Object.keys(jetman640stools.switches);
                var toload = switchkeys.length-1;
                var loopCallback = function(){
                    toload--;
                    if(toload<0)
                    {
                        return false;
                    }
                    loop(loopCallback);
                };
                var loop = function(callback){
                    if(jetman640stools.debug)
                    {
                        console.log("switchkeys[toload]", switchkeys[toload]);
                        console.log("toload",toload);
                    }
                    var switchkey = switchkeys[toload];
                    var settingli = document.createElement("li");
                    var curset = jetman640stools.switches[switchkey];
                    if(localStorage.getItem(switchkey)===null ||
                       localStorage.getItem(switchkey) ==="[object Object]")
                    {
                        //remember to do some null checks because there will be a few
                        if(jetman640stools.debug)
                        {
                            console.log("initializing setting", toload);
                            console.log(switchkey, curset);
                        }
                        localStorage.setItem(switchkey, JSON.stringify(curset));
                    }
                    else
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("loading setting", toload);
                            console.log(switchkey, JSON.parse(localStorage.getItem(switchkey)));
                        }
                        jetman640stools.switches[switchkey].currentvalue = JSON.parse(localStorage.getItem(switchkey)).currentvalue;
                    }
                    if(jetman640stools.debug)
                    {
                        console.log("switchkey", switchkey);
                        console.log("switchkey out", jetman640stools.switches[switchkey]);
                        console.log("settingtype",curset.settingtype);
                    }
                    switch(curset.settingtype)
                    {
                        case "select"://add a select tag
                            var nsel = document.createElement("select");
                            nsel.id = curset.setting;
                            nsel.onchange = jetman640stools.functions.optionchange;
                            settingli.innerHTML = '<lable>'+curset.title+'</lable>';
                            //for(var i = curset.minvalue; i < curset.maxvalue; i = i + curset.stepsize)
                            for(var i in curset.options)
                            {
                                var selected = (curset.currentvalue==curset.options[i])?true:false;
                                var noel = document.createElement("option");
                                noel.value = curset.options[i];
                                noel.innerHTML = curset.options[i];
                                noel.selected = selected;
                                nsel.appendChild(noel);
                                /*
                                if(i<curset.defaultvalue&&(i+curset.stepsize)>curset.defaultvalue)
                                {
                                    //add in a default select value
                                    var noel2 = document.createElement("option");
                                    noel2.value = i;
                                    noel2.innerHTML = i;
                                    noel2.selected = true;
                                    nsel.appendChild(noel2);
                                }*/
                            }
                            jetman640stools.elements[curset.setting] = nsel;
                            settingli.appendChild(nsel);
                            settingsul.appendChild(settingli);
                            break;
                        case "input"://add an input tag
                            break;
                        case "bool"://add a switch/checkbox
                            /*<lable>Display Your Q Info</lable>
                              <span class="switch">
                              <input type="checkbox">
                              <div class="slider" id="etacheck">
                              </div>
                              </span>*/
                            settingli.innerHTML ='<lable>'+curset.title+'</lable>';
                            var nswt = document.createElement("span");
                            var ncb = document.createElement("input");
                            var ndv = document.createElement("div");
                            ndv.id = curset.setting;
                            nswt.className = "switch";
                            ncb.type ="checkbox";
                            ncb.id= curset.setting+"checkbox";
                            ncb.checked = (curset.currentvalue === true|| curset.currentvalue ==='true')? true: false;
                            ndv.className ="slider";
                            ndv.onclick = jetman640stools.functions.optionchange;
                            nswt.appendChild(ncb);
                            nswt.appendChild(ndv);
                            settingli.appendChild(nswt);
                            settingsul.appendChild(settingli);
                            break;
                        case 'none'://just add a first call
                            break;
                    }
                    torun.push(switchkey);
                    callback();
                };
                loop(loopCallback);
                jetman640ssettingsdiv.appendChild(settingsul);
                {
                    //$('<link id="jetman640stoolsstyles" rel="stylesheet" type="text/css" href="raw.githubusercontent.com/Jetman640/Junk/master/Jetman640stools.css">').appendTo('head');
                    //$('<style></style>').load('raw.githubusercontent.com/Jetman640/Junk/master/Jetman640stools.css').appendTo('head');scrrew you cross domain bs
                    $('<style id="jetman640stoolsstyles">' +
                      '#jetman640stools img {' +
                      '/* bottom: -1.4rem; */' +
                      '/* bottom: 0px; */' +
                      'position: relative;' +
                      '/* top: 0; */' +
                      '/* width: 3.4rem; */' +
                      '/* height: 3.4rem; */' +
                      'display: inline;' +
                      'cursor: pointer;' +
                      'vertical-align: top;' +
                      '}' +
                      '#jetman640stools span {' +
                      'cursor: pointer;' +
                      'vertical-align: middle;' +
                      '}' +
                      '#jetman640ssettingsdiv {' +
                      'position: fixed;' +
                      'padding: 0;' +
                      'margin: 0;' +
                      'display: -webkit-box;' +
                      'height: 150px;' +
                      'z-index:9000;' +
                      'width: 25rem;' +
                      'overflow-y: scroll;' +
                      'right: -550px;' +
                      'top: 3.7rem;' +
                      'background: rgba(64, 65, 86, 0.25);' +
                      'box-shadow: 0px 0px 0px 2px rgba(48, 51, 74, 0.25);' +
                      'border-left: 2px;' +
                      'border-bottom: 2px;'+
                      'border-style: outset;' +
                      'border-color: rgba(212, 229, 243, 0.35);' +
                      'backdrop-filter: blur(3px);' +
                      '}' +
                      '#jetman640stools {' +
                      'position: relative;' +
                      'display: inline-block;' +
                      'backdrop-filter: blur(0px);' +
                      '}' +
                      '#jetman640ssettingsdiv ul {' +
                      'width: 100%;' +
                      'height: auto;' +
                      'display: list-item;' +
                      'text-align: right;' +
                      'position: relative;' +
                      '/* margin-right: 0; */' +
                      '/* margin-left: auto; */' +
                      '}' +
                      '#jetman640ssettingsdiv li {' +
                      '/* padding: 3.5rem; */' +
                      'width: 100%;' +
                      'height: 100%;' +
                      '/* margin: 0; */' +
                      'padding-top: 10px;' +
                      'padding-right: 15px;' +
                      'padding-left: 15px;' +
                      'padding-bottom: 0;' +
                      '}' +
                      '#jetman640ssettingsdiv select {' +
                      'width: 100px;' +
                      'height: auto;' +
                      'padding: 5px;' +
                      'background: rgba(64, 65, 86, 0.25);' +
                      'display: inline-block;' +
                      'right: 0;' +
                      'position: relative;' +
                      'text-align: -webkit-right;' +
                      '}</style>').appendTo('head');
                }
                document.body.appendChild(jetman640ssettingsdiv);
                //jetman640stoolsdiv.appendChild(jetman640ssettingsdiv);
                localStorage.jetman640settings = true;//header-right-navigation
                var headerrightnavigation = document.getElementsByClassName("header-right-navigation")[0];
                headerrightnavigation.insertBefore(jetman640stoolsdiv, headerrightnavigation.firstChild.nextSibling);
                jetman640stools.elements["jetman640stoolsdiv"] = jetman640stoolsdiv;
                jetman640stools.elements["jetman640ssettingsdiv"] = jetman640ssettingsdiv;
                jetman640stoolsdiv.onclick = jetman640stools.functions.showoptions;
                $(document).click(jetman640stools.functions.clickaway);
                for(var runcommand in torun)
                {
                    if(jetman640stools.debug)
                    {
                        console.log("checking for a functions for first run", torun[runcommand]);
                    }
                    if(Object.keys(jetman640stools.functions).includes(torun[runcommand]))
                    {
                        if(jetman640stools.debug)
                        {
                            console.log("first time run for command", torun[runcommand]);
                        }
                        jetman640stools.functions[torun[runcommand]]();
                    }
                }
            },
        };
        if(localStorage.getItem("jetman640stoolsdebug") === 'true')
        {
            //localStorage.setItem("jetman640stoolsdebug", jetman640stools.debug);
            jetman640stools.debug = true;
            console.log(jetman640stools.debug, localStorage.getItem("jetman640stoolsdebug"));
        }
        jetman640stools.functions.initialize();
        if(jetman640stools.debug)
        {
            console.log("JetMan640sTools", jetman640stools);
        }
        unsafeWindow.jetman640stools = jetman640stools;
    }
    if(!jetman640stools && Dubtrack.session.id){
        new Jetman640sToolScript();
    }
    else
    {
        var retry = setInterval(function(){
            if(!jetman640stools && Dubtrack.session.id){
                new Jetman640sToolScript();
            }
            else
            {
                //here is where we do some error report
                console.log("error", "unable to launch jetman640stools");
            }
            clearInterval(retry);
        }, 1000);
    }
    // Your code here...
})();