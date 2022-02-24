function initialBotLoad(e) {
    if (e.srcElement.innerText == "Go Back" || e.srcElement.innerText == "Confirm End Chat") {
        getMenuListIndex();
    }
}

function getMenuListIndex() {
    let len = document.getElementsByClassName("rich-menu-items").length;
    for (let i = 0; i < len; i++) {
        if (document.getElementsByClassName("rich-menu-items")[i].children[0].innerText.trim() == "$$MainMenu$$") {
            formatMainMenu(i);
        }
    }
}

function formatMainMenu(classIndex) {
    document.getElementsByClassName("rich-menu-items")[classIndex].classList.add("main-menu-list");
}

function messageListener(e) {
    if (e.data && typeof e.data === "object"){
    if ("method" in e.data && e.data.method == "liveagent.restored") {
        appendCSS();
        let iconEle = document.getElementsByClassName("chatbotStickyIcon")[0];
       
        if(window.innerWidth > 768){
            iconEle.classList.add("minimized");
        }
        getMenuListIndex();
    }

    if ("method" in e.data && e.data.method == "session.updatePrimary") {
        if (document.getElementById("chatbot-new-header") == null) {
            let newElement = document.createElement("div");
             newElement.innerHTML = '<div id="chatbot-new-header">IBRANCE<sup>R</sup><p><span>(palbociclib)</span><span> Virtual Assistant </span></p></div>';
             if(document.querySelectorAll("embeddedservice-chat-header")[0]){
             document.querySelectorAll("embeddedservice-chat-header")[0].appendChild(newElement);
             }
            appendCSS();
        }
    }
    if ("data" in e.data && "event" in e.data.data && e.data.data.event == "agentRichMessage") {
        if (e.data.data.params.items[0].text == "$$MainMenu$$") {
            let classIndex = document.getElementsByClassName("rich-menu-items").length - 1;
            formatMainMenu(classIndex);
        }
        
    }


    /* handle minimize icon change on close button click */
    if ("method" in e.data && e.data.method == "session.deletedSessionData") {
        if (e.data.data.indexOf("ESW_IS_MINIMIZED") != -1) {
            document.querySelector('.page-wrapper .page-left-wrapper .page-header-wrapper .header-wrap .utility-wrapper').classList.remove('greyBannerPlacement');
            let el = document.getElementsByClassName("chatbotStickyIcon")[0];
            el.classList.remove("minimized");
            
        }
    }
    }
    if (e.data && typeof e.data === 'string') {
        if (e.data.indexOf('ChatEstablished') != -1) {
            let message = {
                type: 'ChatEstablished',
                chatKey: liveagent.chasitor.getChatKey()
            };
            window.opener.top.postMessage(message, '*');
        }
        else if (e.data.indexOf('ChatEnded') != -1) {
            let message = {
                type: 'ChatEnded',
                chatKey: liveagent.chasitor.getChatKey()
            };
            window.opener.top.postMessage(message, '*');
        }
    }
}
//Gloval variable Added by SF Team
let globVar;

function showEmbeddedDiv(el) {
    let resultEmbServ = embedded_svc.bootstrapEmbeddedService();
    let chatWindow = document.getElementsByClassName("dockableContainer")[0];
    if (el.className.indexOf("minimized") > -1) {
        el.classList.remove("minimized");
        if("classList" in chatWindow){
            chatWindow.classList.add("hideDockablecontainer");
        }
        
        
    } else { 
        el.classList.add("minimized");
        if (chatWindow != undefined) {
            chatWindow.classList.remove("hideDockablecontainer");
            
        }
    }
    globVar = true;
    if ("none" == getComputedStyle(document.querySelector(".sidebar-isi .isi-wrapper")).display){
        document.querySelector('.page-wrapper .page-left-wrapper .page-header-wrapper .header-wrap .utility-wrapper').classList.add('greyBannerPlacement');
    }
}

if (window.addEventListener) {
    addEventListener('message', messageListener, false);
}
else {
    attachEvent('onmessage', messageListener);
}

document.addEventListener("click", initialBotLoad, false);

/*All the below Code added by SF Team -Need review from Vasundhara*/
embedded_svc.addEventHandler("afterMaximize",function(data){
    if(window.innerWidth < 768) {       
        appendCSS();
        checkBOT();
    }
    setBotDimension();
});

function appendCSS(){
    var cssFa = document.createElement('link');
    cssFa.href = '/sites/default/themes/custom/ibrance/css/custom/IbranceEinsteinBot.min.css';
    cssFa.rel = 'stylesheet';
    cssFa.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(cssFa);
}

function checkBOT() {
    //NEED TO ADD CONDITION ONLY FOR MOBILE SCREEN
    if(globVar==undefined){ 
        let el = document.getElementsByClassName("chatbotStickyIcon")[0]; 
        el.classList.remove("minimized");
        let chatWindow = document.getElementsByClassName("dockableContainer")[0]; 
        if(chatWindow!= undefined){
            chatWindow.classList.add("hideDockablecontainer");
        }
    }            
}
embedded_svc.addEventHandler("onChatEndedByChasitor", function(data) {
    embedded_svc.liveAgentAPI.clearSession();
    });

    if(document.querySelector(".sidebar-isi .isi-wrapper .isi-close")){
        (document.querySelector(".sidebar-isi .isi-wrapper .isi-close")).addEventListener("click",function(){
            setTimeout( setBotDimension,600);
        });
    }

    function setBotDimension(){
    let dockableContainerVar =  document.getElementsByClassName("dockableContainer")[0];
        if(getComputedStyle(document.querySelector(".sidebar-isi .isi-wrapper")).display == "none" ) {
            if (dockableContainerVar){
                dockableContainerVar.style.top = getComputedStyle(document.querySelector(".page-wrapper .page-left-wrapper .page-header-wrapper .header-wrap .utility-wrapper")).height;
                dockableContainerVar.style.left = 0;
                dockableContainerVar.style.minWidth = window.innerWidth - 10 + "px";
                dockableContainerVar.style.width = "100%";
                dockableContainerVar.style.height = "100%";
                dockableContainerVar.style.maxHeight ="80%";
                dockableContainerVar.style.minHeight = window.innerHeight - parseInt(getComputedStyle(document.querySelector(".floating-isi .isi-wrapper")).height.split("px")[0]) - parseInt(getComputedStyle(document.querySelector(".page-wrapper .page-left-wrapper .page-header-wrapper .header-wrap .utility-wrapper")).height.split("px")[0]) + "px";
            }
            if( document.getElementsByClassName("chatbotStickyIcon")[0]){
                document.getElementsByClassName("chatbotStickyIcon")[0].style.bottom = "25%";
            }
        } else {
            var isiElementStyle = getComputedStyle(document.querySelector(".sidebar-isi .isi-wrapper"));
            if (dockableContainerVar){
                dockableContainerVar.style.bottom = window.innerHeight*0.15 + 40 + "px";
                dockableContainerVar.style.height = window.innerHeight*0.8 - 80 + "px";
                dockableContainerVar.style.right = parseInt(isiElementStyle.right.split("px")[0]) + parseInt(isiElementStyle.width.split("px")[0]) + 45 + "px";
                dockableContainerVar.style.width = 320 + "px";
                dockableContainerVar.style.top = "auto";
                dockableContainerVar.style.left = "auto";
                dockableContainerVar.style.minWidth = 0 + "px";
            }
            if( document.getElementsByClassName("chatbotStickyIcon")[0]){
                document.getElementsByClassName("chatbotStickyIcon")[0].style.right = "271px";
                document.getElementsByClassName("chatbotStickyIcon")[0].style.bottom = "12%";
            }
        }
    }                
    
    
    window.addEventListener('resize', function(event){
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function(){
        setBotDimension();
    }, 300);
    });





