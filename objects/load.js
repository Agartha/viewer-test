{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "",
	"generatedBy"   : "Blender 2.66 Exporter",
	"objects"       : 5,
	"geometries"    : 3,
	"materials"     : 2,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Icosphere" : {
		"geometry"  : "geo_Icosphere.001",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 0, 109.441, 54.3233 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 39.9249, 39.9249, 39.9249 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Plane" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ -104.078, -104.078, -104.078 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube" : {
		"geometry"  : "geo_Cube.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 1.53406e-06, -44.8181 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 32.7924, 32.7924, 32.7924 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"default_light" : {
		"type"       : "DirectionalLight",
		"direction"  : [ 0, 1, 1 ],
		"color"      : 16777215,
		"intensity"  : 0.80
	},

	"default_camera" : {
		"type"  : "PerspectiveCamera",
		"fov"   : 60.000000,
		"aspect": 1.333000,
		"near"  : 1.000000,
		"far"   : 10000.000000,
		"position": [ 0, 0, 10 ],
		"target"  : [ 0, 0, 0 ]
	}
},


"geometries" :
{
	"geo_Icosphere.001" : {
		"type" : "ascii",
		"url"  : "load.Icosphere.001.js"
	},

	"geo_Plane" : {
		"type" : "ascii",
		"url"  : "load.Plane.js"
	},

	"geo_Cube.001" : {
		"type" : "ascii",
		"url"  : "load.Cube.001.js"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.001" : {
		"type": "MeshPhongMaterial",
		"parameters": { "color": 10684160, "opacity": 1, "ambient": 10684160, "specular": 8355711, "shininess": 5e+01, "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ -1.5708, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : "default_camera"
}

}
