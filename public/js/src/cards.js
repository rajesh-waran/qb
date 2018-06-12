'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['messageTemplates', 'uuid'], function(messageTpl, uuidv1){

    class CardDesign {

        constructor(card, responseType) {
            this.data = card;
            this.responseType = responseType;
        }

        getHTML(){

            if (this.responseType == "plaintext") {
                console.log(this.data);
                return messageTpl.plaintext(this.data);
            }
			if (this.responseType == "quickreplyfromapiai") {
				console.log(this.data);
				return messageTpl.quickrepliesfromapiai(this.data);
            }
            if (this.responseType == "multiplequickreplyfromapiai") {
				console.log(this.data);
				return messageTpl.multiplequickreplyfromapiai(this.data);
			}
            if(this.responseType == "quickreplies"){
				console.log(this.data);
                return messageTpl.quickreplies(this.data);
            }
        }
    }

    return function(card, responseType){
        return new CardDesign(card, responseType).getHTML();
    }
});