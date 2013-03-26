
    function getShader(gl, id) 
	{
        var shaderScript = document.getElementById(id);
        if (!shaderScript) 
		{
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) 
		{
            if (k.nodeType == 3) 
			{
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") 
		{
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") 
		{
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
		{
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var shaderProgram;

    function compileShaders(vertexShaderName, fragmentShaderName) 
	{
        var fragmentShader = getShader(gl, fragmentShaderName);
        var vertexShader = getShader(gl, vertexShaderName);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
		{
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		
		return shaderProgram;
    }


    var mvMatrix = mat4.create();
	var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function setMatrixUniforms() 
	{
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }
	
	function mvPushMatrix() 
	{
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		mvMatrixStack.push(copy);
	}
	

	function mvPopMatrix() 
	{
		if (mvMatrixStack.length == 0) 
		{
		  throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
    }