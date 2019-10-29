/**
 * 
 * @param {DOM Element} glcanvas Handle to HTML where the glcanvas resides
 * @param {string} shadersrelpath Path to the folder that contains the shaders,
 *                                relative to where the constructor is being called
 */
function HalfEdgeCanvas(glcanvas, shadersrelpath) {
    BaseCanvas(glcanvas, shadersrelpath);
    glcanvas.mesh = new HedgeMesh();
    glcanvas.camera = new MousePolarCamera(glcanvas.width, glcanvas.height);


    /////////////////////////////////////////////////////
    //Step 1: Setup repaint function
    /////////////////////////////////////////////////////    
    glcanvas.repaint = function() {
        glcanvas.gl.viewport(0, 0, glcanvas.gl.viewportWidth, glcanvas.gl.viewportHeight);
        glcanvas.gl.clear(glcanvas.gl.COLOR_BUFFER_BIT | glcanvas.gl.DEPTH_BUFFER_BIT);

        //NOTE: glcanvas has all options we need except
        //for "shaderToUse"
        glcanvas.shaderToUse = glcanvas.shaders.blinnPhong;
        glcanvas.light1 = {pos:glcanvas.camera.pos, color:[1, 1, 1]};
        glcanvas.mesh.render(glcanvas);
    }

    glcanvas.centerCamera = function() {
        this.camera.centerOnMesh(this.mesh);
    }

    glcanvas.gui = new dat.GUI();
    const gui = glcanvas.gui;
    // Mesh display options menu
    glcanvas.drawEdges = false;
    glcanvas.drawNormals = false;
    glcanvas.drawVertices = false;
    let meshOpts = gui.addFolder('Mesh Display Options');
    ['drawEdges', 'drawNormals', 'drawPoints'].forEach(
        function(s) {
            let evt = meshOpts.add(glcanvas, s);
            evt.onChange(function() {
                requestAnimFrame(glcanvas.repaint);
            });
        }
    );

    let simpleRepaint = function() {
        requestAnimFrame(glcanvas.repaint);
    }
    gui.add(glcanvas.mesh, 'saveOffFile').onChange(simpleRepaint);

    requestAnimationFrame(glcanvas.repaint);
}
