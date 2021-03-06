"use strict";

window.simpleModel = function (name) {
    const self = this;
    self.name = name;
    self.indices = [];
	self.vertices = [];
	self.normals = [];
	// self.uvCoord = uv;

};

window.createModel = function (modelObj) {

    
    const model = new simpleModel("flowerPot");
    model.indices = [].concat.apply([], modelObj.meshes[0].faces);
    // Vertex data
    model.vertices = modelObj.meshes[0].vertices;
	model.color = new Float32Array( [0.5, 0.0, 0.3, 1.0]); 
	model.normals = modelObj.meshes[0].normals;
    
    return model;
  };