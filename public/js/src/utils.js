'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define([], function () {

    var methods = {};

    methods.currentTime = () => {

        var currentDate = new Date();
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
        var hours = (currentDate.getHours() < 10) ? '0' + currentDate.getHours() : currentDate.getHours();
        var minutes = (currentDate.getMinutes() < 10) ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        return `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${hours}:${minutes} ${ampm}`;
    };

    methods.scrollSmoothToBottom = (element) => {
		//console.log('element',element);
		
        setTimeout(() => {
            var height = element[0].scrollHeight;
            element.scrollTop(height);
			//var objDiv = document.getElementById("scrollbar-style");
			//objDiv.scrollTop = objDiv.scrollHeight;
        }, 500);
    };
    return methods;
});