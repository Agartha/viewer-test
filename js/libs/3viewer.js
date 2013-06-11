function ObjectList (source) {
	this.meshList = {};
	this.lightList = {};
	this.helperList = {};
	this.waypointList = {};
	this.waypointArray = [];
	this.init = function (){
		for (object in source){
			var obj = source[object];
			this.addObject(obj);
		}
	};
	this.addObject = function(obj){
		if (obj instanceof THREE.Mesh){
			this.meshList[obj.name] = {};
			var objProp = this.meshList[obj.name]
			objProp['object'] = obj;
			objProp['geometry'] = obj.geometry.name;
			objProp['material'] = obj.material.name;
			objProp['position'] = [obj.position.x, obj.position.y, obj.position.z];
			objProp['rotation'] = [obj.rotation.x, obj.rotation.y, obj.rotation.z];
			objProp['quaternion'] = obj.quaternion;
			objProp['scale'] = [obj.scale.x, obj.scale.y, obj.scale.z];
			objProp['visible'] = obj.visible;
			objProp['castShadow'] = obj.castShadow;
			objProp['receiveShadow'] = obj.receiveShadow;
			objProp['doubleSided'] = false;
		}
		if (obj instanceof THREE.DirectionalLight ){
			this.lightList[obj.name] = {};
			var objProp = this.lightList[obj.name]
			
			objProp['object'] = obj;
			//console.log(obj.target.positon)
			objProp['type'] = 'DirectionalLight';
			//objProp['direction'] = [obj.direction.x, obj.direction.y, obj.direction.z];
			objProp['type'] = 'DirectionalLight';
			objProp['color'] = '16777215';
			objProp['intensity'] = '1';
		}
		if (obj instanceof THREE.PointLight ){
			obj.name = this.validateName(obj.name, this.lightList)
			
			this.lightList[obj.name] = {};
			var objProp = this.lightList[obj.name]
			
			objProp['object'] = obj;
			objProp['type'] = 'PointLight';
			this.addHelper(obj.position, obj, 'PointLight')
		}
		jQuery("body").trigger("model_addObject", [obj]);
	};
	this.addHelper = function(position, connection, type){
	
		material = new THREE.MeshBasicMaterial( { color: 0x00ee00, wireframe: false, transparent: true } );
		geometry = new THREE.CubeGeometry( 1, 1, 1 );
		helper = new THREE.Mesh( geometry, material );
		helper.name = 'helper_'+connection.name;
		helper.position = position;

		this.helperList[helper.name] = {};
		var objProp = this.helperList[helper.name];
		objProp['object'] = helper;
		objProp['connection'] = connection;
		objProp['type'] = type;
		jQuery("body").trigger("model_addHelper", [helper]);
	};
	this.addWaypoint = function(x,y,z, rx, ry, rz){
	
		var material = new THREE.MeshBasicMaterial( { color: 0x70ee88, wireframe: true, transparent: true } );
		var geometry = new THREE.CylinderGeometry( 0, 1, 2, 9, 1 )
		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.setRotationFromEuler({'x':Math.PI/2, 'y':0, 'z':0});
		geometry.applyMatrix(rotationMatrix);
		var waypoint = new THREE.Mesh( geometry, material );
		waypoint.name = this.validateName('waypoint', this.waypointList);
		waypoint.position.x = x;
		waypoint.position.y = y;
		waypoint.position.z = z;
		if(rx){
			waypoint.rotation.x = rx;
			waypoint.rotation.y = ry;
			waypoint.rotation.z = rz;
		}
		waypoint.isWaypoint = true;

		this.waypointList[waypoint.name] = {};
		this.waypointArray.push(waypoint);
		var objProp = this.waypointList[waypoint.name];
		objProp['object'] = waypoint;
		objProp['step'] = 0;
		jQuery("body").trigger("model_addWaypoint", [waypoint]);
	};
	this.removeWaypoint = function(name){
		var objProp = this.waypointList[name].object;
		delete this.waypointList[name];
		jQuery("body").trigger("model_removeWaypoint", [objProp]);
	}
	this.validateName = function(name, list){
		var currentName = name;
		var inuse = false;
		var inc = 0;
		for (var usedObj in list){
			if (usedObj == currentName){
				inuse = true;
				inc = inc + 1;
				currentName = currentName + inc;
				while (inuse){
					for (var usedObj in list){
						if (usedObj == currentName){
							inuse = true;
							inc = inc+1;
							currentName = currentName + inc;
						}else{
							inuse = false;
						}
					}
				}
			}
		}
		return currentName;
	};
	this.init()
};

function MaterialList (source) {
	this.materials = {};
	this.init = function (){
		for (material in source){
			var mat = source[material];
			this.addMaterial(mat);
		}
	};
	this.addMaterial = function(mat){

		this.materials[mat.name] = {};
		var matProp = this.materials[mat.name]
		matProp['material'] = mat;

		jQuery("body").trigger("model_addMaterial", [matProp]);
	};
	this.init()
};


function OverrideController (scene) {
	var self = this;
	this.materialList = {};
	this.materialList.wireframe = new THREE.MeshBasicMaterial( { color: 0x70ee88, wireframe: true, transparent: true } );
	this.materialList.white = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, transparent: true } );
	this.currentMaterial = 'wireframe';
	this.enabled = false;
	
	this.update = function (){
		if(self.enabled == true){
			scene.overrideMaterial = self.materialList[self.currentMaterial];
			
			//console.log(self.materialList[self.currentMaterial])
		}
	}
	this.start = function (materialName){
		self.currentMaterial = materialName;
		//self.enabled = true;
		for (mat in materialList.materials){
				materialList.materials[mat].wireframeOld = materialList.materials[mat].material.wireframe;
				//materialList.materials[mat].material.wireframe = true;
				
				materialList.materials[mat].material.map = '';
				materialList.materials[mat].material.bump = '';
				
				materialList.materials[mat].material.needsUpdate = true;
				//console.log(materialList.materials[mat].color)
		}
		
		for (var ob in objectList.meshList){				
				objectList.meshList[ob].object.material = self.materialList.wireframe
				
				objectList.meshList[ob].object.material.needsUpdate = true;
		}
		
		
	}
};


function ViewScene(scene){
	jQuery("body").on("model_addObject", function(event, data){ 
		scene.add( data );
	});
	jQuery("body").on("model_addHelper", function(event, data){ 
		scene.add( data );
	});
	jQuery("body").on("model_addWaypoint", function(event, data){ 
		scene.add( data );
	});
	jQuery("body").on("model_removeWaypoint", function(event, data){ 
		scene.remove( data );
	});
	
	
};

function KeyViewsController(camera){
	var self = this;
	var waypoints;
	var currentWaypoint = -1;
	this.update;
	
	this.toogleWaypoint = function(){
		for (var wp in objectList.waypointArray){
			objectList.waypointArray[wp].visible = !objectList.waypointArray[wp].visible;
		}
	}
	
	this.displayInfo = function(){
		if (currentWaypoint == 0){
		
			jQuery("#user_popup").html("<img src='info0.jpg' width='auto' height='100%' />");
			jQuery("#user_popup").fadeIn();
			jQuery("#user_popup").click(function(){
				jQuery(this).fadeOut();
			});
		}
		if (currentWaypoint == 1){
			jQuery("#user_popup").html("<img src='info1.jpg' width='auto' height='100%' />");
			jQuery("#user_popup").fadeIn();
			jQuery("#user_popup").click(function(){
				jQuery(this).fadeOut();
			});
			var position = { time : 130};
			var target = { time : 0};
			var end = new TWEEN.Tween( target ).to(position,3000 ).onUpdate(function(){
				skyDiveController.changeSkyTime(target.time);
				sunPositionController.sunPosition(1991, 5, 19, target.time/10, 0);
			});
			
			new TWEEN.Tween( position ).to(target,4500 ).onUpdate(function(){
				//console.log(position.time)
				skyDiveController.changeSkyTime(position.time);
				sunPositionController.sunPosition(1991, 5, 19, position.time/10, 0);
			}).onComplete(function(){
				skyDiveController.changeSkyTime(130);
				sunPositionController.sunPosition(1991, 5, 19, 130/10, 0);
			}).start();
			
		}
		if (currentWaypoint == 2){
			jQuery("#user_popup").html("<img src='info2.jpg' width='auto' height='100%' />");
			jQuery("#user_popup").fadeIn();
			jQuery("#user_popup").click(function(){
				jQuery(this).fadeOut();
			});
			
		}
		if (currentWaypoint == 3){
			jQuery("#user_popup").html("<img src='info3.jpg' width='auto' height='100%' />");
			jQuery("#user_popup").fadeIn();
			jQuery("#user_popup").click(function(){
				jQuery(this).fadeOut();
			});
			objectInspector.mouseMoveDemo();
			setTimeout('objectInspector.mouseMoveDemoStop()', 10000);
		}
		if (currentWaypoint == 4){
			jQuery("#user_popup").html("<img src='info4.jpg' width='auto' height='100%' />");
			jQuery("#user_popup").fadeIn();
			jQuery("#user_popup").click(function(){
				jQuery(this).fadeOut();
			});
		}
	}
	this.hideInfo = function(){
		jQuery("#user_popup").html("");
		jQuery("#user_popup").fadeOut();
	}
	
	//rtt render
	//this.RTTRenderer.setSize( SCREEN_WIDTH/10, SCREEN_HEIGHT/10 );
	
	this.moveObjectToA = function(object, position, rotation, duration){
		var animationData = {
		   name: "bla",
		   fps: 0.6,
		   length: duration,
		   hierarchy: []
		};
		controls.target.z = position[0];
		controls.target.y = position[1];
		controls.target.x = position[2];
		camera.useQuaternions = true;
		var i,parentAnimation;
		parentAnimation = { parent: -1, keys: [] };
		parentAnimation.keys[ 0 ] = { time: 0,  pos: [object.position.x,object.position.y,object.position.z], rot: [ -12, -2, -52], scl: [ 1, 1, 1 ] };
		parentAnimation.keys[ 1  ] = { time: duration, pos: position,  rot: [rotation[0],rotation[1],rotation[2]], scl: [ 1, 1, 1 ] };

		animationData.hierarchy[ 0 ] = parentAnimation;
		THREE.AnimationHandler.add( animationData );
		var anim =  new THREE.Animation( object, "bla", THREE.AnimationHandler.CATMULLROM_FORWARD);
		anim.play(false);
	}
	this.moveObjectTo = function(object, position, rotation, duration){
		//console.log(currentWaypoint)
		//console.log(controls.enabled)
		//controls.enabled = false;
		camera.up = new THREE.Vector3(0, 1, 0); // TODO controls mess with up vector. Need to clear all this
		
		position = objectList.waypointArray[currentWaypoint].position;
		//place a cube in front of each point
		rotation = objectList.waypointArray[currentWaypoint].rotation;
		var newPos = self.findFrontPoint(position, rotation)
		
		console.log(object.rotation)
		
		//stop
		new TWEEN.Tween( object.position ).to( 
			{ x:position.x , y:  position.y, z:position.z},
			//{ x:position[0] , y:  position[1], z:position[2]}, 
			3000 
		).start();
		new TWEEN.Tween( controls.target ).to({ x:newPos[0] , y:  newPos[1], z:newPos[2]},3000 ).onComplete(function(){
			setTimeout('controls.enabled = true;', 2000);
			self.displayInfo();
		}).start();
		//new TWEEN.Tween( object.rotation  ).to({ x:rotation.x , y:  rotation.y, z:0},3000 ).start();
        //new TWEEN.Tween( object.rotation ).to( { z:  object.rotation.z + (3.14/4)}, 10000 ).start();
		//new TWEEN.Tween( controls.target ).to( { x:position[0]+0.1, y:  position[1]+0.1, z:position[2]+0.1}, 10000 ).start();
		
	}
	this.getWaypoints = function(){
		waypoints = [];
		waypointList = objectList.waypointList
		for (var id in waypointList){
			var position = waypointList[id].object.position;
			waypoints.push([position.x, position.y, position.z]);
		}
	}
	
	this.moveCameraToByID = function(id){
		//console.log(id)
		currentWaypoint = parseInt(id) //id is a number here
		var position;
		self.moveObjectTo(camera, position, [3.14/2,0.5,0.02], 10);
	}
	
	this.findFrontPoint = function(position, rotation){
		var unitVectorTarget = [0,0,(-1*2)];
		//var rum = [0,0,(-1)];
		//var rxy = unitVectorTarget[1] * Math.cos(rotation.x) + unitVectorTarget[2]*Math.sin(rotation.x);
		//var rxz = -unitVectorTarget[1] * Math.sin(rotation.x) + unitVectorTarget[2]*Math.cos(rotation.x);
		//unitVectorTarget[1] = rxy;
		//unitVectorTarget[2] = rxz;
		
		//var rzx = unitVectorTarget[0] * Math.cos(rotation.z) - unitVectorTarget[1]*Math.sin(rotation.z);
		//var rzy = unitVectorTarget[0] * Math.sin(rotation.z) + unitVectorTarget[1]*Math.cos(rotation.z);
		//unitVectorTarget[0] = rzx;
		//unitVectorTarget[1] = rzy;
		//var ryx = unitVectorTarget[0] * Math.cos(rotation.y) + unitVectorTarget[2]*Math.sin(rotation.y);
		//var ryz = (-unitVectorTarget[0]) * Math.sin(rotation.y) + unitVectorTarget[2]*Math.cos(rotation.y);
		//unitVectorTarget[0] = ryx;
		//unitVectorTarget[2] = ryz;
		
		var rotationMatrix = new THREE.Matrix4();
		var vector = new THREE.Vector3(0,0,-250)
		rotationMatrix.setRotationFromEuler({'x':rotation.x, 'y':rotation.y, 'z':rotation.z});
		var res = rotationMatrix.multiplyVector3(vector);
		unitVectorTarget[0]=res.x;
		unitVectorTarget[1]=res.y;
		unitVectorTarget[2]=res.z;

		var newPos = [];
		newPos[0] = position.x + unitVectorTarget[0];
		newPos[1] = position.y + unitVectorTarget[1];
		newPos[2] = position.z + unitVectorTarget[2];
		return newPos
	}
	
	this.updateWaypointWiew = function(renderer,scene, camera,containerId){
		var currentPos = camera.position;
		if (self.update == true){
			self.update = false;
			var container = jQuery("#"+containerId+"");
			var i = -1;
			for (var id in waypointList){
				i =i+1;
				var position = waypointList[id].object.position;
				var rotation = waypointList[id].object.rotation;
				camera.position.x = position.x;
				camera.position.y = position.y;
				camera.position.z = position.z;
				camera.rotation.x = rotation.x;
				camera.rotation.y = rotation.y;
				camera.rotation.z = rotation.z;
				//camera.lookAt( scene.position );
				

				
				renderer.setSize( SCREEN_WIDTH/10, SCREEN_HEIGHT/10 );
				renderer.render( scene, camera)
				//var img = new Image();
				var wpSrc = renderer.domElement.toDataURL("image/png")
				container.append("<img id='"+i+"' class='view_point_thumb' src="+wpSrc+" width='94px' height='auto' style='float:left; margin:0px; cursor:pointer;'/>");
				//waypoints.push([position.x, position.y, position.z]);
			}
			container.append("<div class='clearfix'></div>");
			container.append("<div id='viewDisplayProp' style='width:180px; height:27px; background:#181818; cursor:pointer;' ><p>Toogle view markers</p></div>");
			camera.position = currentPos;
			renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
			
			jQuery('.view_point_thumb').click(function(event){
				self.moveCameraToByID( jQuery(this).attr("id") );
				controls.enabled = true;
			});
			jQuery('#viewDisplayProp').click(function(event){
				self.toogleWaypoint();
			});
			//renderer.render( scene, cameraRTT)
			//console.log(delta)
			//var w = window.open('', '');
			//var img = new Image();
			//img.src = renderer.domElement.toDataURL("image/png")
			//w.document.body.appendChild(img);
		}
	}
	
	this.goToNextWaypoint = function(){
		currentWaypoint = currentWaypoint +1;
		self.hideInfo();
		self.moveObjectTo(camera, [50,50,50], [3.14/2,0.5,0.02], 10);
	}
	this.goToPreviousWaypoint = function(){
		self.hideInfo();
		if (currentWaypoint > 0){
			currentWaypoint = currentWaypoint-1;
			self.moveObjectTo(camera, [50,50,50], [3.14/2,0.5,0.02], 10);
		}
	}
	jQuery('body').keydown(function(event){
		if (event.keyCode == 65){
			
			//controls.enabled = false;
			//camera.up = new THREE.Vector3(0,1,0)
			
			currentWaypoint = currentWaypoint +1;
			self.moveObjectTo(camera, [50,50,50], [3.14/2,0.5,0.02], 10);
			
		}else if (event.keyCode == 90){
			//controls.enabled = false;
			//camera.up = new THREE.Vector3(0,1,0)
			if (currentWaypoint > 0){
				currentWaypoint = currentWaypoint-1;
				console.log('click')
				self.moveObjectTo(camera, [50,50,50], [3.14/2,0.5,0.02], 10);
			}
			
		}
	});
	
};

function ControllerScene(scene, objectList){
	
	this.addObject = function(type) {
		if (type == 'CUBE'){
			var material = new THREE.MeshLambertMaterial( { color:0xffffff } );
			var geometry = new THREE.CubeGeometry( 5, 5, 5 );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.y = 0;
			cube.position.x = 0;
			cube.position.z = 0;
			cube.name = 'cube'
			objectList.addObject(cube);
		}else if (type == 'POINT_LIGHT'){
			light1 = new THREE.PointLight( 0xffffff, 2, 30 );
			light1.position.set( 0, 5, 0 );
			light1.name = 'new_light';
			objectList.addObject(light1);
			
			
			var directionalLight = new THREE.DirectionalLight( 0xff0fff);
			directionalLight.position.set( 0, 0, 0 ).normalize();
			directionalLight.rotation.z = 3.14;
			directionalLight.rotation.y = 155.14;
			directionalLight.rotation.x = 3.14;
			directionalLight.position.x = -500;
			directionalLight.position.y = 1050;
			directionalLight.position.z = 550;
			directionalLight.castShadow = true;
			//directionalLight.shadowCameraVisible = true;
			//scene.add( directionalLight );
		}else if (type == 'WAYPOINT'){
			objectList.addWaypoint(0,0,60);
		}
	}
	this.removeObject = function(type, name) {
		if (type == 'WAYPOINT'){
			objectList.removeWaypoint(name);
		}
	}
}

function ObjectLoader(objectName){
	var self = this;
	var path = "./objects/";
	this.loaded;
	
	this.loadScene = function (){
		var callbackProgress = function( progress, result ) {
			var bar = 100;
			var total = progress.totalModels + progress.totalTextures;
			self.loaded = progress.loadedModels + progress.loadedTextures;

			if ( total )
				bar = Math.floor( bar * self.loaded / total );
			console.log(bar + "%");
			count = 0;
			for ( var m in result.materials ) count++;
		}
		var callbackFinished = function( result ) {
			self.loaded = result;
			for (var object in result.objects){
				scene.add( result.objects[object] );
			}
		}
		var callbackSync = function( result ) {
			console.log('loading')
		}
		var loader = new THREE.SceneLoader();
		loader.callbackSync = callbackSync;
		loader.callbackProgress = callbackProgress;
		loader.load( path + objectName, callbackFinished );
	}
	
	this.loadScene();
}
function SkyDiveController(){
	var self = this;
	var format = '.jpg';
	var sunColor = 0xffffff;
	this.ambiant;
	this.skyBox;
	this.skyMaterial;
	skyBoxInitOffset = -1.5;
	
	this.initSky = function(scene, path){
		var urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];
		var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
		reflectionCube.format = THREE.RGBFormat;

		var refractionCube = new THREE.Texture( reflectionCube.image, new THREE.CubeRefractionMapping() );
		refractionCube.format = THREE.RGBFormat;
		// Skybox

		var shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ "tCube" ].value = reflectionCube;

		var material = new THREE.ShaderMaterial( {

			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide

		} );

		//tmesh = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000 ), material );
		//scene.add( tmesh );
		
		var materialArray = [];
		for (var i = 0; i < 6; i++){
			var matCube = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( urls[i]), side: THREE.BackSide,depthWrite: false, color:0xffffff })
			materialArray.push( matCube);
		}
		//console.log(materialArray);
		self.skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		//console.log('skymaterial');
		//console.log(self.skyMaterial);
		self.skyBox = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000 ), self.skyMaterial );
		self.skyBox.rotation.y = -1.2; 
		scene.add( self.skyBox );
		
		if(baseConfig['cubeReflections'] == true){
			for (var mat in loaded.materials){
				if(mat == config['cubeMapmaterials']){
					loaded.materials[mat].envMap = reflectionCube;
					loaded.materials[mat].reflectivity = 0.65;
				}
			}
		}
	}
	this.initAmbiant = function(scene, colors, intensity) {
		self.ambiant = new THREE.AmbientLight(0xffffff);
		ambiantIntensity = intensity+0.2
		intensity = intensity+0.2
		self.ambiant.color.setRGB( colors[0] * intensity, colors[1] * intensity, colors[2] * intensity );
		scene.add(self.ambiant);
	}
	this.changeSkyTime = function(time){
		var sunPercent;
		var sunOffset;
		if (time < 120){
			sunPercent = time/120;
			sunOffset = -Math.PI*(1-sunPercent)
		}else{
			sunPercent = (240-time)/120;
			sunOffset = Math.PI*(1-sunPercent)
		}
		var intensity = sunPercent+0.2;
		self.ambiant.color.setRGB( 1 * intensity, 1 * intensity, 1 * intensity );
		for (var mat in self.skyMaterial.materials){
			self.skyMaterial.materials[mat].color.setRGB( 1 * sunPercent, 1 * sunPercent, 1 * sunPercent );
			self.skyMaterial.materials[mat].needsUpdate = true;
		}
		self.skyBox.rotation.y = skyBoxInitOffset + sunOffset;
		
	}
}

function lensFlareUpdateCallback( object ) {
	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;

	for( f = 0; f < fl; f++ ) {
		   flare = object.lensFlares[ f ];
		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;
		   flare.rotation = 0;
	}
	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}

function addLensFlare(scene, position, hslcolor){

			//lens
		// TODO : move this elsewhere
		
		var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
		light.color.setHSL( hslcolor[0], hslcolor[1], hslcolor[2] );
		light.position.set( position[0], position[1], position[2] );
		//scene.add( light );


		var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0.png" );
		var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflarehexa.jpg" );
		var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare3.png" );
		
		var flareColor = new THREE.Color( 0xffffff );
		//flareColor.setHSL( hslcolor[0], hslcolor[1], hslcolor[2] );
		
		var lensFlare = new THREE.LensFlare( textureFlare0, 400, 0.0, THREE.AdditiveBlending, flareColor );
		

		lensFlare.add( textureFlare2,  60, 0.2, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare2, 170, 0.3, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare2, 220, 0.4, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare2,  80, 0.5, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare2,  70, 0.6, THREE.AdditiveBlending, flareColor );

		lensFlare.add( textureFlare3,  70, 0.1, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3, 220, 0.2, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3, 100, 0.3, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3,  90, 0.4, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3,  80, 0.5, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3,  500, 0.9, THREE.AdditiveBlending, flareColor );
		
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.physicallyBasedShading = true;

		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.set(position[0], position[1], position[2]);
		//console.log('lens')

		scene.add( lensFlare );
		
		//lens -- End
}

function initShadows(renderer, camera, objects){
	if ( baseConfig['shadows']== true){
		renderer.shadowMapEnabled = true;
	}
	renderer.shadowMapSoft = true;
	renderer.shadowCameraNear = 50;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 50;

	//renderer.shadowMapBias = 0.000019;
	renderer.shadowMapDarkness = 0.6;
	renderer.shadowMapWidth = 2048;
	renderer.shadowMapHeight = 2048;
	
	scene.fog = new THREE.Fog( 0xffffff, 30, 150 );
	scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
	
	renderer.setClearColor( scene.fog.color, 1 );
	
	for (o in objects){
		if (o == 'default_light'){
		objects[o].color.setHSL( 1,1, 1 );
		objects[o].castShadow = true;
		//objects[o].shadowCameraVisible = true;

		//objects[o].shadowCameraLeft = -50;
		//objects[o].shadowCameraRight = 50;
		//objects[o].shadowCameraTop = 50;
		//objects[o].shadowCameraBottom = -50;
		
		objects[o].shadowMapWidth = 2048;
		objects[o].shadowMapHeight = 2048;
		objects[o].shadowBias = 0.0018;
		
		objects[o].position.set( 0, 0, 0 ).normalize();
		objects[o].rotation.z = 3.14;
		objects[o].rotation.y = 155.14;
		objects[o].rotation.x = 3.14;
		objects[o].position.x = -500;
		objects[o].position.y = 1050;
		objects[o].position.z = 550;
		}else{
		objects[o].castShadow;
		objects[o].receiveShadow;
		}
	}
}



function createStats(container) {

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.right = '0px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.style.display = 'none';
	container.appendChild( stats.domElement );
	jQuery('body').keydown(function(event){
		if (event.keyCode == 84){
			if(stats.domElement.style.display == 'none'){
				stats.domElement.style.display = 'block';
			}else{
				stats.domElement.style.display = 'none';
			}
		}
	});
}

function refreshSceneInspector(objectList, containerId) {
	var container = jQuery("#"+containerId+"");
	container.html('');
	
	for (object in objectList.lightList){
		container.append("<p>"+ object + "<input type='checkbox' id="+object+" class='toogleable prop_light_visible' /><label for="+object+">Visibility</label>");
	}
	for (object in objectList.meshList){
		container.append("<p>"+ object + "<input type='checkbox' id="+object+" class='toogleable prop_obj_visible' /><label for="+object+">Visibility</label>");
	}
	
	jQuery('.toogleable').button();
	jQuery('.prop_obj_visible').click(function() {
		id = jQuery(this).attr('id');
		objectList.meshList[id].object.visible = !objectList.meshList[id].object.visible;
	});
	jQuery('.prop_light_visible').click(function() {
		id = jQuery(this).attr('id');
		objectList.lightList[id].object.visible = !objectList.lightList[id].object.visible;
	});

}

function AnimationCameraController(scene, objectInspector, objectList) {
	//camera
	var self = this;
	var originalCameraPositon;
	var originalCameraRotation;
	var currentTime = 0;
	var waypoints;
	jQuery('body').keydown(function(event){
		if (event.keyCode == 80){
			//self.setPathCamera();
		}else if (event.keyCode == 74){
			//self.tooglePlay();
		}
	});
	this.tooglePlay = function(){
		if(controls.animation.isPaused){
			controls.animation.play( true, currentTime );
		}else{
			currentTime = controls.animation.currentTime;
			controls.animation.pause();
		}
	}
	this.initWaypoints = function(list){
		waypoints = [];
		for (var i in list){
			position = list[i];
			console.log(position)
			if (position[3]){
				objectList.addWaypoint(position[0],position[1],position[2],position[3],position[4],position[5]);
				console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
			}else{
				objectList.addWaypoint(position[0],position[1],position[2]);
				console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhee")
			}
			waypoints.push(position);
			//console.log(waypoints);
		}
	}
	this.updateWaypoints = function(){
		waypoints = [];
		waypointList = objectList.waypointList
		for (var id in waypointList){
			var position = waypointList[id].object.position;
			waypoints.push([position.x, position.y, position.z]);
		}
	}
	this.setPathCamera = function(){
		//camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		originalCameraPositon = camera.position.clone();
		originalCameraRotation = camera.rotation.clone();
		camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		controls.target.z = 0;
		controls.target.x = 0;
		controls.target.y = 0;
		controls = new THREE.PathControls( camera );

		controls.waypoints = waypoints;
		controls.duration = 28
		controls.useConstantSpeed = true;
		//controls.createDebugPath = true;
		//controls.createDebugDummy = true;
		controls.lookSpeed = 0.06;
		controls.lookVertical = true;
		controls.lookHorizontal = true;
		controls.verticalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 1.1, 3.8 ] };
		controls.horizontalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0.3, Math.PI - 0.3 ] };
		controls.lon = 180;
		//controls.verticalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 1.1, 3.8] };
		//controls.horizontalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0.3, Math.PI - 0.5 ] };
		//controls.lon = 180;

		controls.init();

		scene.add( controls.animationParent );
		
		controls.animation.play( true, 0 );
		if (post){
			post = new ViewEffectComposer(renderer, scene, camera, ['dotScreen','RGBShift'])
		}
	}
	this.setTrackballCamera = function(){
		//camera end
		scene.remove( controls.animationParent );
		camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		controls = new THREE.TrackballControls( camera );
		controls.target.z = 0;
		camera.rotation = originalCameraRotation.clone();
		camera.position= originalCameraPositon.clone();
		objectInspector.updateCamera(camera);
		if (post){
			post = new ViewEffectComposer(renderer, scene, camera, ['dotScreen','RGBShift'])
		}
	}
	jQuery("body").on("model_addWaypoint", this.updateWaypoints);
	jQuery("body").on("model_removeWaypoint", this.updateWaypoints);

};

