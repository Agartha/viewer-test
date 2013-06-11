viewerCreateLoadScene = function() {

	var result = {

		scene:  new THREE.Scene(),
		camera: new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 )

	};
	
	

	result.camera.position.z = 40;

	var object, geometry, material, light, count = 800, range = 50;

	material = new THREE.MeshLambertMaterial( { color:0xCF182B } );
	geometry = new THREE.CubeGeometry( 2, 2, 2 );

	for( var i = 0; i < count; i++ ) {
		
		object = new THREE.Mesh( geometry, material );
		
		var posx = (Math.random() - 0.5 ) * range;
		var posz = (Math.random() - 0.5 ) * range;
		object.position.x = posx - 20;
		object.position.y = (( Math.random() - 0.5 ) * range/10) -25;
		object.position.z = posz;
		
		var randomheight = (Math.random() ) * range;
		var pos_sum = posx+posz;
		if (pos_sum < 0){
			pos_sum = pos_sum * (-1);
		}
		//var pos_vector_len = ( (posx*posx)+(posz*posz) );
		object.scale.y = (randomheight/(pos_sum+0.2)) ;
		
		object.rotation.y= 6.8;
		object.rotation.z = -0.9;

		object.matrixAutoUpdate = false;
		object.updateMatrix();

		result.scene.add( object );

	}

	result.scene.matrixAutoUpdate = false;

	light = new THREE.PointLight( 0xffffff );
	result.scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.x = 1;
	result.scene.add( light );
	
	var ambient = new THREE.AmbientLight(0xffffff);
	ambient.color.setRGB( 1 * 0.1, 1 * 0.1, 1 * 0.1 );
	result.scene.add(ambient);

	return result;

}