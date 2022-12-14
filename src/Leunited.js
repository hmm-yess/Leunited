//https://gather.town/api/getMap?spaceId=VJ01mwNnpyXsL76g\\Leunited&mapId=rootstown-office-main&apiKey=CqJ8NIBnx3VZlDIQ
const { Game } = require("@gathertown/gather-game-client");
const game = new Game('VJ01mwNnpyXsL76g\\Leunited', () => Promise.resolve({ apiKey: 'CqJ8NIBnx3VZlDIQ' }));
global.WebSocket = require("isomorphic-ws");
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

game.enter({isNpc:true},'pdZnTdb7VShWtOz6F2xdVAJ4nOs2')

game.subscribeToEvent('playerJoins',(data,context) => {
	if (game.players[context.playerId].isNpc != true){
		game.engine.sendAction({
		$case: "chat",
			chat: { 
				chatRecipient: context.playerId,
				contents: `Hello this is badmin bot.
				Type /help to see more details.`,
				localPlayerIds: [],
				mapId: 'blank',
			}
		});
	}
});

game.subscribeToEvent("playerMoves", (data, context) => {
	var pid = context.playerId;
	var player_affiliation = context.player.affiliation;
	var res_pos = [{'x':48, 'y':63}, {'x':48, 'y':64}, {'x':48, 'y':65},]
	for (var i = 0; i<res_pos.length; i++){
		if (data.playerMoves.x == res_pos[i]['x'] && data.playerMoves.y == res_pos[i]['y']){
			if (player_affiliation != 'ally'){
				game.teleport('blank',50,72,pid);
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: context.playerId,
							contents: 'Look like you are not our ally?',
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
				break;
			}
		}	
	}
});

game.subscribeToEvent("playerChats", (data, context) => {
	const message = data.playerChats;
	if (message.messageType === "DM") {
		switch (message.contents.toLowerCase()) {
			case "/help":
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: data.playerChats.senderId,
							contents: `1. To be our guild member type /regis.
							2. Type /leave for left guild.
							3. Type /id to get your player id.`,
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
				break;
			case "/regis":
				if (context.player.affiliation != 'ally'){
					game.setAffiliation('ally',data.playerChats.senderId);
					game.notify(`${context?.player?.name ?? context.playerId} join Leunited!!`);
					game.engine.sendAction({
						$case: "chat",
							chat: { 
								chatRecipient: data.playerChats.senderId,
								contents: `Successful register!
								Welcome to our guild.`,
								localPlayerIds: [],
								mapId: 'blank',
							}
					});
				}
				else{
					game.engine.sendAction({
						$case: "chat",
							chat: { 
								chatRecipient: data.playerChats.senderId,
								contents: 'You have been our guild member!',
								localPlayerIds: [],
								mapId: 'blank',
							}
					});
				}
				break;
			case "/id":
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: data.playerChats.senderId,
							contents: `Your id is ${data.playerChats.senderId}`,
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
				break;
			case "/market":
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: data.playerChats.senderId,
							contents: `Welcome to our guild market place!
							To receive buff press x
							1. Speed-buff: cost 20 recoin
							2. Teleport to gate: cost 50 recoin`,
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
				break;
			case "/leave":
				game.setAffiliation('',data.playerChats.senderId);
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: data.playerChats.senderId,
							contents: 'You are not guild member for now.',
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
				game.teleport('blank',50,72,data.playerChats.senderId);
				break;
			default:
				game.engine.sendAction({
					$case: "chat",
						chat: { 
							chatRecipient: data.playerChats.senderId,
							contents: 'What do you mean?',
							localPlayerIds: [],
							mapId: 'blank',
						}
				});
		}
	}
});

game.subscribeToEvent("playerInteracts", (data, context) => {
	var obj = game.partialMaps.blank.objects;
	var obj_key = Object.keys(obj);
	for (var i = 0; i<obj_key.length;i++){
		if(data.playerInteracts.objId == obj[obj_key[i]].id){
			console.log(obj[obj_key[i]]._tags);
			if(obj[obj_key[i]]._tags.includes('buff-speed')){
				game.setSpeedModifier(3,context.playerId);
				setTimeout(()=>{
					game.setSpeedModifier(1,context.playerId);
				},5000);
			}
			if(obj[obj_key[i]]._tags.includes('buff-teleporter')){
				game.teleport('blank',53,95,context.playerId);
			}
		}
	}
	//console.log(game.partialMaps.blank.objects[String(data.playerInteracts.encId)]._tags);
	/*if (data.playerInteracts.objId == 'guard-sm'){
		game.engine.sendAction({
			$case: "mapDeleteObjectById",
				mapDeleteObjectById: { 
					id: data.playerInteracts.objId,
					mapId: 'blank',
				}
		});
	}*/
});

setInterval(()=>{
	if (game.partialMaps.blank.backgroundImagePath == 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/map/main-dark.png'){
		game.engine.sendAction({
				$case: "mapSetBackgroundImagePath",
				mapSetBackgroundImagePath:{
					mapId: 'blank',
					backgroundImagePath: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/map/main.png',
				}
			});
	}
	else{
		game.engine.sendAction({
				$case: "mapSetBackgroundImagePath",
				mapSetBackgroundImagePath:{
					mapId: 'blank',
					backgroundImagePath: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/map/main-dark.png',
				}
			});
	}
},60000);
/***************************************************************************/

game.subscribeToEvent('playerTriggersItem',(data,context) => {
	console.log(data.playerTriggersItem.encId); //space bar
});

game.engine.sendAction({
	$case: "mapAddObject",
	mapAddObject: { 
		mapId: 'blank',
		object: {
			_name: 'Great Red Wyrm',
			_tags: 'gif-obj',
			x: 50,
			y: 57,
			normal: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/obj/sprite_sheet/dragon01/Animations/Great%20Red%20Wyrm/Greate%20Red%20Wyrm.png',
			highlighted: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/obj/sprite_sheet/dragon01/Animations/Great%20Red%20Wyrm/Greate%20Red%20Wyrm.png',
			type: 0,
			distThreshold : 2,
			width: 1,
			height: 1,
			id: 'Great Red Wyrm-01',
			spritesheet: {
				spritesheetUrl: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/obj/sprite_sheet/dragon01/Animations/Great%20Red%20Wyrm/Greate%20Red%20Wyrm.png',
				animations: {
						'idle-s': {
							sequence: [ 0, 7 ],
							frameRate: 8,
							useSequenceAsRange: true,
							loop: true
						},
				},
				framing: { 
					frameWidth: 32, frameHeight: 32
				},
				currentAnim: 'idle-s'
			},
		}
	}
});

game.engine.sendAction({
	$case: "mapAddObject",
	mapAddObject: { 
		mapId: 'blank',
		object: {
			_name: 'teleporter',
			_tags: ['buff-obj','buff-teleporter'],
			x: 31,
			y: 63,
			normal: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/obj/img/portal-pack/portal-rz01.png',
			highlighted: 'https://raw.githubusercontent.com/hmm-yess/Leunited/master/obj/img/portal-pack/portal-rz01.png',
			type: 5,
			distThreshold: 1,
			previewMessage: 'teleport',
			width: 1,
			height: 1,
			id: 'teleporter-01',
		}
	}
});

game.engine.sendAction({
	$case: 'addInventoryItem',
	addInventoryItem: {
		itemId: 'recoin',
		delta: {
			items:{
				count: 2,
			},
			order:'left-hand',
		},
		targetId: 'oQPy7UIe50eBXFX3n07VLfXqDHu1',
	}
});

game.engine.sendAction({
	$case: 'removeInventoryItem',
	removeInventoryItem: {
		itemId: 'recoin',
		delta: {
			items:{
				count: 10,
			},
			order:'left-hand',
		},
		targetId: 'oQPy7UIe50eBXFX3n07VLfXqDHu1',
	}
});