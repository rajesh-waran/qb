'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */
//display: inline-block;




define(["utils", "settings"], function (utils, settings) {

    var methods = {};
    methods.bullets = (data) => {
        var bulletPoints = '';
        if (data.indexOf('>') >= 0) {
            bulletPoints = data.split('>');
            return "<i class='material-icons' style='color: #28a745;font-weight: bold;clear:both;font-size:15px;float:left !important'>check</i>" + bulletPoints.join("<br><i class='material-icons' style='clear:both;color: #28a745;font-weight: bold;float:left !important;font-size:15px'>check</i>");
        } else {
            return data;
        }
    }
    //User Plain Text
    methods.userplaintext = (data) => {

        let html = `<li class="list-group-item background-color-custom">
            <div class="media-left pull-right animated fadeInRight">

            <div class="media-body user-txt-space">
            <img style="border-radius:50%;border:2px solid white;float: right;margin-right: 10px;" width="32" height="32" src='${settings.userAvatar}'/>
            <p class="list-group-item-text-user">${data.payload} <span class="bot-res-timestamp abs">${data.time}</span></p>`;

        // if (data.bottomIcon) {
        //     html += `<p class="user-timestamp"> ${data.time}</p>`;
        // }
        html += `</div></li>`;

        return html;
    }

    //Plain Text Template
    methods.plaintext = (data) => {
        let html = `<li class="list-group-item background-color-custom">
       
        <div class="media-body bot-txt-space animated fadeInLeft">`
        //if (data.responseIndex) {
        html += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="32" height="32" src='${settings.botAvatar}'/>
        <p class="list-group-item-text-bot beforeAfter">${data.payload} <span class="bot-res-timestamp abs receiver"> ${data.time}</span></p>`;
        // } else {
        // html += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-text-bot">` + methods.bullets(data.payload) + `</p>`;
        // }
       
        // if (data.bottomIcon) {
        // html += `<p class="bot-res-timestamp"> ${data.time}</p>`;
        // }
        html += `</div>
        </li>`;
       
        return html;
    }

    methods.quickreplies = (data) => {
        var quickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft">`;

        for (let i in data.payload) {


            if (data.payload[i].platform == "facebook") {
                if (data.payload[i].payload.facebook.hasOwnProperty('quick_replies')) {
                    quickRepliesHtml += `<p class="list-group-item-quick-reply-space${data.color}">${data.payload[i].payload.facebook.text}</p><div class="quick-replies-buttons">`;
                    for (var j = 0; j < data.payload[i].payload.facebook.quick_replies.length; j++) {
                        if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('payload')) {
                            quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" data-quickRepliesPayload="${data.payload[i].payload.facebook.quick_replies[j].payload}">${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                        }
                        else if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('url')) {
                            console.log("URL : " + data.payload[i].payload.facebook.quick_replies[j].url);
                            quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.location.href='${data.payload[i].payload.facebook.quick_replies[j].url}'; 'height=400,width=600'" >${data.payload[i].payload.facebook.quick_replies[j].title}</button>`

                        }
                        else if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('tab')) {
                            console.log("TAB : " + data.payload[i].payload.facebook.quick_replies[j].tab);
                            quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.open('${data.payload[i].payload.facebook.quick_replies[j].tab}','_blank'); " > ${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                        }
                    }
                }
            }
        }
        quickRepliesHtml += `</div>`;
        if (data.bottomIcon) {
            quickRepliesHtml += `<p class="bot-res-timestamp-qr"> <img style="border-radius:50%;border:2px solid white;" width="32" height="32" src='${settings.botAvatar}'/>${data.time}</p>`;
        }
        quickRepliesHtml += `</div></li>`
        return quickRepliesHtml;
    }

    methods.multiplequickreplyfromapiai = (data) => {
        var apiquickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft">`
        let qReply;
        if (data.payload) {
            qReply = data.payload;
        } else {
            qReply = data;
        }
        for (let i in qReply) {
            if (qReply[i].platform == "facebook" && qReply[i].type == "2") {
                if (data.responseIndex) {
                    apiquickRepliesHtml += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="32" height="32" src='${settings.botAvatar}'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<p class="list-group-item-quick-reply-space beforeAfter">${qReply[i].title}</p>`
                    }
                } else {
                    //apiquickRepliesHtml+=	`<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-quick-reply-space">${qReply[i].title}</p>`
                    }

                }
                apiquickRepliesHtml += `<div class="quick-replies-buttons" style="align-items: center;justify-content: center;"  data-toggle="buttons">`
                for (let j = 0; j < qReply[i].replies.length; j++) {
                    apiquickRepliesHtml += `<label class="btn btn-test padding-10px apiMultipleQuickreplybtnPayload" data-apiMultiplequickRepliesPayload="${qReply[i].replies[j]}">
                    <input type="checkbox" name="riskname"> ${qReply[i].replies[j]}
                </label>`;
                    //apiquickRepliesHtml += `<button type="button" class="btn btn-primary active apiMultipleQuickreplybtnPayload" data-apiMultiplequickRepliesPayload="${qReply[i].replies[j]}"><div class="quick-reply-button-text">${qReply[i].replies[j]}</button>`
                }
                apiquickRepliesHtml += `<button type="button" id= "multiBt"  class="btn pmd-btn-outline pmd-ripple-effect btn-success .pmd-btn-fab multiple-click disabled padding15"><div>Choose</button>`
            }
        }
        apiquickRepliesHtml += `</div>`;
        // if (data.bottomIcon) {
        //     apiquickRepliesHtml += `<p class="bot-res-timestamp-qr"> ${data.time}</p>`;
        // }
        apiquickRepliesHtml += `</div></li>`;
        return apiquickRepliesHtml;
    }

    methods.quickrepliesfromapiai = (data) => {
        
        var apiquickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft">`
        // <div class="media-left">
        //     <a href="javascript:void(0);" class="avatar-list-img">
        //     <img class="img-responsive" src="${data.senderAvatar}">
        //     </a>
        // </div>
        // <div class="media-body">
        // <h3 class="list-group-item-heading">${data.senderName}</h3>`;
        let qReply;
        if (data.payload) {
            qReply = data.payload;
        } else {
            qReply = data;
        }

        for (let i in qReply) {
            if (qReply[i].platform == "facebook" && qReply[i].type == "2") {
                if (data.responseIndex) {
                    apiquickRepliesHtml += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="32" height="32" src='${settings.botAvatar}'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<p class="list-group-item-quick-reply-space beforeAfter">${qReply[i].title}</p>`
                    }
                } else {
                    //apiquickRepliesHtml+=	`<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-quick-reply-space">${qReply[i].title}</p>`
                    }

                }
                apiquickRepliesHtml += `<div class="quick-replies-buttons" style="align-items: center;justify-content: center;">`

                if (qReply[i].replies.indexOf("Risk Class") != -1) {
                    for (let j = 0; j < qReply[i].replies.length; j++) {
                            apiquickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}"><img src="./images/queryTypes/${qReply[i].replies[j].replace(/ /g, '')}.svg" class="img-responsive quick-reply-icon"> <div class="quick-reply-button-text">${qReply[i].replies[j]}</div></button>`
                    }
                } else {
                    for (let j = 0; j < qReply[i].replies.length; j++) {
                            apiquickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}">${qReply[i].replies[j]}</button>`
                    }
                }
            }
        }
        apiquickRepliesHtml += `</div>`;
        // if (data.bottomIcon) {
        //     apiquickRepliesHtml += `<p class="bot-res-timestamp-qr"> ${data.time}</p>`;
        // }
        apiquickRepliesHtml += `</div></li>`;
        return apiquickRepliesHtml;
    }

    return methods;
});