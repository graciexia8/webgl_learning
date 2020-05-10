window.PrismRender = function(gl, program, model, model_color, Matrix){
    var self = this;

    var triangle_vertex_buffer_id = null;
    var triangles_color_buffer_id = null;
    var a_Vertex_location = null;
    var a_Color_location = null;

    function _createBufferObject(gl, data) {
        // Create a buffer object
        var buffer_id;
    
        buffer_id = gl.createBuffer();
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
        vertices3 = new Float32Array(numVertices*3);
        color3 = new Float32Array(numVertices*3);


        nv = 0;
        nc = 0;
        //go through each triangle
        for (k = 0; k < numTriangles; k++){
            
            var triangle = model.triangle[k];
            //load model values into buffer object
            //for each vertex in  current triangle[k]
            for (i = 0; i < 3; i++){

                //for each x,y,z coordinate
                for (j = 0; j < 3; j++, nv++){
                    vertices3[nv] = triangle.vertices[i][j];
                }

                for(m = 0; m < 3; m++, nc++){
                    color3[nc] =  triangle.colors[i][m];
                }

            }

        }
        
        console.log(color3);
        console.log(vertices3);
            //create new buffer object
        triangle_vertex_buffer_id = _createBufferObject(gl, vertices3);
        triangles_color_buffer_id = _createBufferObject(gl, color3);

        vertices3 = null;
        color3 = null;
    }

    function _getLocationOfShaderVariables() {
        // Get the location of the shader variables
        a_Color_location = gl.getUniformLocation(program, 'vertexColor');
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
    
        // Set the color for all of the triangle faces
        //gl.uniform4fv(u_Color_location, model_color); //feeds these values to the vertexColor parameter
    
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
        var matModelUniformLocation = gl.getUniformLocation(program, 'mWorld');
        var matViewUniformLocation = gl.getUniformLocation(program, 'mView'); //have not actually learned at this
        var matProfUniformLocation = gl.getUniformLocation(program, 'mProj'); //have not actually learned about this

        //intiailize empty 1d representations of 4x4 matrices of different transforms
        modelMatrix = Matrix.create();
        viewMatrix = Matrix.create();
        projMatrix = Matrix.create();

        //set all three matrices to the identity matrix
        Matrix.setIdentity(modelMatrix);
        Matrix.setIdentity(viewMatrix);
        Matrix.setIdentity(projMatrix);

        //link to the shader variables mWorld, mView, and mProj
        gl.uniformMatrix4fv(matModelUniformLocation, gl.FALSE, modelMatrix);
	    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProfUniformLocation, gl.FALSE, projMatrix);
        
        //create identity matrix
        var identity_Matrix = Matrix.create();
        Matrix.setIdentity(identity_Matrix);

        //create roation matrix around y axis
        var YRotationMatrix = Matrix.create();
        var rotationAngle = 0; //angle that we will use to rotate
        var animationLoop = function(){
            rotationAngle = rotationAngle + 1.4;
            Matrix.rotate(modelMatrix,rotationAngle, 0.4, 1, 0);
            //Matrix.rotate(YRotationMatrix, rotationAngle, 0.0, 1.0, 0.0);
            //Matrix.multiplySeries(modelMatrix, YRotationMatrix);
            gl.uniformMatrix4fv(matModelUniformLocation, gl.FALSE, modelMatrix);

            // Draw all of the triangles
            gl.drawArrays(gl.TRIANGLES, 0, numTriangles*3);
            window.requestAnimationFrame(animationLoop);

        }
       
        window.requestAnimationFrame(animationLoop);
    
    };


}