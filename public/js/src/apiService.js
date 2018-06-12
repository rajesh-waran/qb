'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
	function ($, config, utils, messageTpl, cards, uuidv1) {

		class ApiHandler {

			constructor() {
				this.options = {
					sessionId: uuidv1(),
					lang: "en"
				};
			}

			userSays(userInput, callback) {
				callback(null, messageTpl.userplaintext({
					"payload": userInput,
					"senderName": config.userTitle,
					"senderAvatar": config.userAvatar,
					"bottomIcon": true,
					"time": utils.currentTime(),
					"className": 'pull-right'
				}));
			}

			askBot(userInput, callback) {
				if(userInput && userInput != ''){
					this.userSays(userInput, callback);
					this.options.query = userInput;

					console.log(userInput, JSON.stringify(this.options), config.chatServerURL);
					$.ajax({
						type: "POST",
						url: config.chatServerURL,
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						/*headers: {
							"Authorization": "Bearer " + config.accessToken
						},*/
						data: JSON.stringify(this.options),
						success: function (response) {
							let isCardorCarousel = false;
							let isImage = false;
							let isQuickReply = false;
							let isQuickReplyFromApiai = false, isMultipleQuickReplyFromApiai = false;
							let isList = false;
							let resIndex = "0";
							let responsesSettings = {
								"isCardorCarousel": [],
								"isImage": [],
								"isVideo": [],
								"isQuickReplyFromApiai": [],
								"isMultipleQuickReplyFromApiai": [],
								"isList": [],
								"audioUrl": [],
								"isFile": [],
								"isReceipt": [],
								"isQuickReply": []
							};
							let bottomFlag = false;
							let listData = null;
							let webviewData = null;
							let isWebView = false;
							//To find Card || Carousel
							let count = 0;
							let hasbutton;
							let buttons;

							console.log(response);
							if (response.status && response.status.code != 200) {
								let cardHTML = cards({
									"payload": response.status.errorDetails,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"className": ''
								}, "plaintext");
								callback(null, cardHTML);
							} else {
								if (response.result.fulfillment.messages) {
									for (let i in response.result.fulfillment.messages) {

										bottomFlag = false;
										resIndex = 1;
										if (i > 0) {
											resIndex = 0;
										}
										if (i == response.result.fulfillment.messages.length - 1) {
											bottomFlag = true;
										}

										if (response.result.fulfillment.messages[i].type == 0) {
											let cardHTML = cards({
												"payload": response.result.fulfillment.messages[i].speech,
												"senderName": config.botTitle,
												"senderAvatar": config.botAvatar,
												"time": utils.currentTime(),
												"responseIndex": resIndex,
												"bottomIcon": bottomFlag,
												"className": ''
											}, "plaintext");
											callback(null, cardHTML);
										}
										if (response.result.fulfillment.messages[i].type == 1) {
											count = count + 1;
											if (count == response.result.fulfillment.messages.length) {
												resIndex = 1;
											}
											hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
											isCardorCarousel = true;
											responsesSettings['isCardorCarousel'][0] = resIndex;
											responsesSettings['isCardorCarousel'][1] = bottomFlag;
										}
										if (response.result.fulfillment.messages[i].type == 2) {
											if (response.result.fulfillment.messages[i].replies && response.result.fulfillment.messages[i].replies.indexOf("Crime") != -1) {
												response.result.fulfillment.messages[i].replies = [" Commercial Property", " Commercial General Liability", " Business interruption insurance", " Crime", " Data Breach & Cyber Liability Coverage",  " Other Additional Commercial Coverages"]
												isMultipleQuickReplyFromApiai = true;
												responsesSettings['isMultipleQuickReplyFromApiai'][0] = resIndex;
												responsesSettings['isMultipleQuickReplyFromApiai'][1] = bottomFlag;
											} else {
												isQuickReplyFromApiai = true;
												responsesSettings['isQuickReplyFromApiai'][0] = resIndex;
												responsesSettings['isQuickReplyFromApiai'][1] = bottomFlag;
											}
										}
										if (response.result.fulfillment.messages[i].type == 3) {
											isImage = true;
											responsesSettings['isImage'][0] = resIndex;
											responsesSettings['isImage'][1] = bottomFlag;
										}
										if (response.result.fulfillment.messages[i].type == 4) {

											console.log(response.result.fulfillment.messages[i]);
											//isQuickReply = (response.result.fulfillment.messages[i].payload.facebook.quick_replies.length > 0) ? true : false ;
											//console.log(isQuickReply);
											if (response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type == "list") {
												console.log('list');
												isList = true;
												listData = response.result.fulfillment.messages;
												responsesSettings['isList'][0] = resIndex;
												responsesSettings['isList'][1] = bottomFlag;
												//console.log(isReceipt);
											}
											
											
											if (['button', 'generic'].indexOf(response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type) >= 0) {
												console.log(JSON.stringify(response));
												buttons = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.buttons;
												for (let l = 0; l < buttons.length; l++) {
													if (buttons[l].type == 'web_url') {
														isWebView = true;
														webviewData = response.result.fulfillment.messages[i].payload.facebook.attachment.payload;
													}
												}
											}
										}
									}
								} else {
									let cardHTML = cards({
										"payload": response.result.fulfillment.speech,
										"senderName": config.botTitle,
										"senderAvatar": config.botAvatar,
										"responseIndex": resIndex,
										"time": utils.currentTime(),
										"bottomIcon": bottomFlag,
										"className": ''
									}, "plaintext");
									callback(null, cardHTML);
								}
							}
							
							//Image Response
							if (isImage) {
								let cardHTML = cards(response.result.fulfillment.messages, "image");
								callback(null, cardHTML);
							}
							//CustomPayload Quickreplies
							if (isQuickReply) {
								let cardHTML = cards({
									"payload": response.result.fulfillment.messages,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"responseIndex": responsesSettings['isQuickReply'][0],
									"bottomIcon": responsesSettings['isQuickReply'][1],
									"className": ''
								}, "quickreplies");
								callback(null, cardHTML);
							}
							//Apiai Quickreply
							if (isQuickReplyFromApiai) {
								let cardHTML = cards({
									"payload": response.result.fulfillment.messages,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"responseIndex": responsesSettings['isQuickReplyFromApiai'][0],
									"bottomIcon": responsesSettings['isQuickReplyFromApiai'][1],
									"className": ''
								}, "quickreplyfromapiai");
								callback(null, cardHTML);
							}
							if (isMultipleQuickReplyFromApiai) {
								let cardHTML = cards({
									"payload": response.result.fulfillment.messages,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"responseIndex": responsesSettings['isMultipleQuickReplyFromApiai'][0],
									"bottomIcon": responsesSettings['isMultipleQuickReplyFromApiai'][1],
									"className": ''
								}, "multiplequickreplyfromapiai");
								callback(null, cardHTML);
							}
							if (isList) {
								console.log('cards calling - list');
								let cardHTML = cards({
									"payload": listData,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"responseIndex": responsesSettings['isList'][0],
									"bottomIcon": responsesSettings['isList'][1],
									"time": utils.currentTime(),
									"className": ''
								}, "list");
								callback(null, cardHTML);
							}
						},
						error: function () {
							callback("Internal Server Error", null);
						}
					});
				}
			}
		}

		return function (accessToken) {
			return new ApiHandler();
		}
	});