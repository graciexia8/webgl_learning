"use strict";

window.CubeRender = function(gl, program, model, Matrix){
    const self = this;

    let triangle_vertex_buffer_id = null;
    let triangles_color_buffer_id = null;
    let a_Vertex_location = null;
    let a_Color_location = null;
    let numTriangles;
    let numVertices;

    function _createBufferObject(gl, data) {
        // Create a buffer object
        const buffer_id = gl.createBuffer();

        if (!buffer_id) {
          out.displayError('Failed to create the buffer object for ' + model.name);
          return null;
        }
    
        // Make the buffer object the active buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
    
        // Upload the data for this buffer object to the GPU.
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    
        return buffer_id;
      }

    function _buildBufferObjectData() {

        numTriangles = model.triangle.length;
        numVertices = numTriangles*3;

        //the buffer object to hold the triangles vertices
        let vertices3 = new Float32Array(numVertices*3);
        let color3 = new Float32Array(numVertices*3);


        let nv = 0;
        let nc = 0;
        //go through each triangle
        for ( let k = 0; k < numTriangles; k++){
            
            const triangle = model.triangle[k];
            //load model values into buffer object
            //for each vertex in  current triangle[k]
            for ( let i = 0; i < 3; i++){

                //for each x,y,z coordinate
                for ( let j = 0; j < 3; j++, nv++){
                    vertices3[nv] = triangle.vertices[i][j];
                }

                for( let m = 0; m < 3; m++, nc++){
                    color3[nc] =  triangle.colors[i][m];
                }

            }

        }
        
        //create new buffer object
        triangle_vertex_buffer_id = _createBufferObject(gl, vertices3);
        triangles_color_buffer_id = _createBufferObject(gl, color3);

        vertices3 = null;
        color3 = null;
    }

    function _getLocationOfShaderVariables() {
        // Get the location of the shader variables
        a_Color_location = gl.getAttribLocation(program, 'vertexColor');
        a_Vertex_location = gl.getAttribLocation(program,  'vertexPosition');
    }

    // These one-time tasks set up the rendering of the models.
    _buildBufferObjectData();
    _getLocationOfShaderVariables();

    self.delete = function (gl) {
        if (numTriangles > 0) {
          gl.deleteBuffer(triangles_vertex_buffer_id);
        }
    };

    self.render = function (gl) {

        gl.useProgram(program);
    
        // Activate the model's vertex Buffer Object
        gl.bindBuffer(gl.ARRAY_BUFFER, triangle_vertex_buffer_id);
    
        // Bind the vertices Buffer Object to the 'a_Vertex' shader variable
        gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Vertex_location);

        // Activate the model's color Buffer Object
        gl.bindBuffer(gl.ARRAY_BUFFER, triangles_color_buffer_id);

        
        // Bind the color Buffer Object to the 'a_Color' shader variable
        gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color_location);


        //get the locations of the matrices in the shader vectors
        const matModelUniformLocation = gl.getUniformLocation(program, 'mWorld');
        const matViewUniformLocation = gl.getUniformLocation(program, 'mView'); //have not actually learned at this
        const matProfUniformLocation = gl.getUniformLocation(program, 'mProj'); //have not actually learned about this

        //intiailize empty 1d representations of 4x4 matrices of different transforms
        let modelMatrix = Matrix.create();
        let viewMatrix = Matrix.create();
        let projMatrix = Matrix.create();

        //set all three matrices to the identity matrix
        Matrix.setIdentity(modelMatrix);

        Matrix.lookAt(viewMatrix,0,0,0.5,0,0,0,0,1,0);
        projMatrix = Matrix.createOrthographic(-2,2,-2,2,-2,2);
        
        //link to the shader variables mWorld, mView, and mProj
        gl.uniformMatrix4fv(matModelUniformLocation, gl.FALSE, modelMatrix);
	    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProfUniformLocation, gl.FALSE, projMatrix);
        
        //create identity matrix
        let identity_Matrix = Matrix.create();
        Matrix.setIdentity(identity_Matrix);

        //create roation matrix around y axis
        let YRotationMatrix = Matrix.create();
        let TranslationMatrix = Matrix.create();

        let rotationAngle = 0; //angle that we will use to rotate
        let translationAngle = 0;
        let animationLoop = function(){

            gl.clearColor(0.0, 0.5, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

            rotationAngle = rotationAngle + 4;
            Matrix.rotate(modelMatrix,rotationAngle,0.5, 0.2, 1);
            
            gl.uniformMatrix4fv(matModelUniformLocation, gl.FALSE, modelMatrix);

            // Draw all of the triangles
            gl.drawArrays(gl.TRIANGLES, 0, numTriangles*3);
            window.requestAnimationFrame(animationLoop);

        }
       
        window.requestAnimationFrame(animationLoop);
    
    };


}