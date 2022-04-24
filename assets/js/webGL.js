var iFrame = 0
var running = true
var __shaderTemplate = `out vec4 glFragColor;

// code here
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main()  {
    glFragColor.w = 1.;
    mainImage(glFragColor, gl_FragCoord.xy);
}`

var shaderTemplate = `precision highp float;

uniform float iFrame;
uniform vec2 iResolution;


// code here
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 col = vec3(0.0);

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main()  {
    gl_FragColor.w = 1.0;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}`

//
//
//

function createShader(gl, sourceCode, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    return shader;
}

function render() {
    if (running) {
        window.requestAnimationFrame(render, canvas);
    }

    resize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // set uniforms
    gl.uniform1f(
        gl.getUniformLocation(program, "iFrame"),
        iFrame
    );

    gl.uniform2fv(
        gl.getUniformLocation(program, "iResolution"),
        [
            gl.canvas.width,
            gl.canvas.height,
        ]
    );

    document.getElementById("info").innerText = iFrame

    iFrame++
}

function main() {
    canvas = document.querySelector("#gl-view");

    // Initialize the GL context
    gl = canvas.getContext("webgl2", {
        antialias: false,
        depth: false,
        preserveDrawingBuffer: true,
    });

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0]),
        gl.STATIC_DRAW
    );

    var vertexShaderSource = `
        attribute vec2 position;
  
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `

    var fragmentShaderSource = shaderTemplate;

    program = gl.createProgram();

    vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    render();
}

function reloadFragmentShader() {
    var shaderSrc = editor.getValue();

    var shader = createShader(gl, shaderSrc, gl.FRAGMENT_SHADER);

    gl.detachShader(program, fragmentShader);
    gl.attachShader(program, shader);

    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    fragmentShader = shader;
}

function resize(canvas) {
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        aspectRatio = displayWidth / displayHeight;
    }
}

window.onload = main