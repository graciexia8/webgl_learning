window.triangleRender = function(gl, program, model, model_color){
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
        
        numVertices = 3;
        //the buffer object to hold the triangles vertices
        vertices2 = new Float32Array(numVertices*2);
        color3 = new Float32Array(numVertices*3);


        nv = 0;
        nc = 0;

            //load model values into buffer object
        for (i = 0; i < 3; i++){
            for (j = 0; j < 2; j++, nv++){
                vertices2[nv] = model.triangle.vertices[i][j];
            }

            for(m = 0; m < 3; m++, nc++){
                color3[nc] = model.triangle.colors[i][m];
            }

        }

            //create new buffer object
        triangle_vertex_buffer_id = _createBufferObject(gl, vertices2);

        triangles_color_buffer_id = _createBufferObject(gl, color3);
        vertices2 = null;
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
        if (number_triangles > 0) {
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
        gl.vertexAttribPointer(a_Vertex_location, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Vertex_location);

        // Activate the model's color Buffer Object
        gl.bindBuffer(gl.ARRAY_BUFFER, triangles_color_buffer_id);

        
        // Bind the color Buffer Object to the 'a_Color' shader variable
        gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color_location);


    
        // Draw all of the triangles
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    
    };


}