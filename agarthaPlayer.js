if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container,stats;

var objectList, sceneInspector, controllerScene, viewScene, objectInspector, animationCameraController, viewScenePathInspector;
var materialList, materialInspector, sensorView, overrideController;

var sunPositionController, skyDiveController;
var textureChangerDemo;

var camera, scene, ambiant,ambiantIntensity, loaded, controls;
var renderer, post;

var rtTexture, cameraRTT, keyViewsController;
var shot = false;
var nowTime = 0;
var mesh, zmesh, geometry;

var mouse = { x: 0, y: 0 }, projector, INTERSECTED;
var clock = new THREE.Clock();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var baseConfig;
var config = config_advanced;

var scene_path = config['scene_path'];

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function $( id ) {
	return document.getElementById( id );
}

function init() {

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var loadScene = viewerCreateLoadScene();

	camera = loadScene.camera;
	cameraRTT = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	scene = loadScene.scene;

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
	renderer.clearColor = 0xffffff;

	container.appendChild( renderer.domElement );
	
	controls = new THREE.TrackballControls( camera );
	controls.target.z = 0;

	projector = new THREE.Projector();

	createStats(container);
	
	jQuery("#startHD").click(function(){   
		baseConfig = config_high;
		onStartClick();
	});
	jQuery("#startLD").click(function(){   
		baseConfig = config_low;
		onStartClick();
	});

	var callbackProgress = function( progress, result ) {
		var bar = 100,
			total = progress.totalModels + progress.totalTextures,
			loaded = progress.loadedModels + progress.loadedTextures;

		if ( total )
			bar = Math.floor( bar * loaded / total );
		$( "bar" ).style.width = bar + "%";
		count = 0;
		for ( var m in result.materials ) count++;
	}

	var callbackFinished = function( result ) {

		loaded = result;

		$( "message" ).style.display = "none";
		$( "spinner" ).style.display = "none";
		$( "spinnerlogo" ).style.display = "block";		
		$( "start" ).style.display = "block";
		$( "start" ).className = "enabled";
	}
	var callbackSync = function( result ) {
	}

	$( "progress" ).style.display = "block";

	var loader = new THREE.SceneLoader();
	loader.callbackSync = callbackSync;
	loader.callbackProgress = callbackProgress;
	loader.load( scene_path, callbackFinished );
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onStartClick() {

	$( "progress" ).style.display = "none";
	$( "progressinfo" ).style.display = "none";
	
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;

	camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	var cameraInitPos = config['cameraInitPos']
	camera.position.x = cameraInitPos[0];
	camera.position.z = cameraInitPos[1];
	camera.position.y =cameraInitPos[2];

	controls = new THREE.TrackballControls( camera );
	controls.target.z = 0;

	
	var loadedScene = new THREE.Scene();
	
	//check for grass to hide if low def
	if(baseConfig['grass'] == false){
		for( var obj in loaded.objects){
			if (loaded.objects[obj].name.substring(0, 5) == "grass"){
				loaded.objects[obj].visible = false;
				delete loaded.objects[obj]; //remove grass totaly
			}
		}
	}

	// Check if cubmap needed
	skyDiveController = new SkyDiveController();
	
	if (config['cubeMap'] == true){
		skyDiveController.initSky(loadedScene, config['cubeMapTexture'] );
	}
	viewScene = new ViewScene(loadedScene);
	
	initShadows(renderer, camera, loaded.objects);
	
	skyDiveController.initAmbiant(loadedScene, [1,1,1], config['ambiantIntensity'])
	
	
	objectList = new ObjectList(loaded.objects);
	materialList = new MaterialList(loaded.materials);
	controllerScene = new ControllerScene(loadedScene, objectList);


	scene = loadedScene;
	
	animationCameraController = new AnimationCameraController(scene, objectInspector, objectList)
	animationCameraController.initWaypoints(config['wayPoint'])
	
	
	
	if(baseConfig['postEffects'] == true){
		post = new ViewEffectComposer(renderer, scene, camera, ['dotScreen','RGBShift'])
	}
	
	//keyviews
	keyViewsController  = new KeyViewsController(camera);
	keyViewsController.toogleWaypoint()
	//keyviews end
	
	//rt postprocess
		cameraRTT = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		cameraRTT.position.z = 100;
		scene.add(cameraRTT);
		rtTexture = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBFormat } );
	
	//var overrideController = new OverrideController(scene);
	//overrideController.start('white')
	
	//rt end
	

	//controls -> TOMOVE
	$( "user_controls" ).style.display = "block";
	$( "user_controls_left" ).style.display = "block";
	$( "user_menu" ).style.display = "block";
	$( "vendor_logo" ).style.display = "block";
	
	jQuery('#ui_mode_mode').click(function(){
		if (jQuery(this).attr("data-state") == 'orbit'){
			animationCameraController.setPathCamera();
			jQuery(this).attr("src", 'ui_mode2.png');
			jQuery(this).attr("data-state", 'path');
		}else{
			animationCameraController.setTrackballCamera();
			jQuery(this).attr("src", 'ui_mode1.png');
			jQuery(this).attr("data-state", 'orbit');
			
		}
	});
	jQuery('#ui_mode').click(function(){
		keyViewsController.goToNextWaypoint();
	});
	jQuery('body').keydown(function(event){
		if (event.keyCode == 76){
		    console.log('loader');
			var objectLoader = new ObjectLoader("load.js");
		}
	});
	
	
	jQuery('#ui_menu').click(function(){
		if (jQuery(this).attr("data-state") == 'visible'){
			jQuery("#user_menu").animate({'left':'-400px'});
			jQuery(this).attr("data-state", 'hidden');
			
		}else{
			jQuery("#user_menu").animate({'left':'15%'});
			jQuery(this).attr("data-state", 'visible');
			if (jQuery(this).attr("data-vp") == 'none'){
				keyViewsController.update = true;
				jQuery(this).attr("data-vp", 'generated');
			}
			
		}
	});
	jQuery('#ui_pause').click(function(){
		keyViewsController.goToPreviousWaypoint();
	});
}

function onDocumentMouseMove(event) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function lolage(){
	var delta = clock.getDelta();
	nowTime = nowTime+1;
}


function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();
	TWEEN.update();
	lolage();
	
}

function render() {
	
	//camera.lookAt( scene.position );
	var delta = clock.getDelta();
	THREE.AnimationHandler.update( delta );
	
	if (controls.enabled == true) {
		controls.update( delta );
	}
	
	renderer.render( scene, camera, rtTexture, true )
	
	if(keyViewsController){
		keyViewsController.updateWaypointWiew(renderer, scene, cameraRTT,"section_Keypoints_prop");
	}
	
	if (post){		
		renderer.clear();

		post.generateDepthPass('depthTarget');
		post.composer.render();
	}else{
		renderer.clear();
		renderer.render( scene, camera );
	}
}
