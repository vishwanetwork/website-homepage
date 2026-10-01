/* Vishwa cinematic glass architecture. Three.js r160, locally vendored.
 * No animation loop, event listeners, external requests, or DOM dependencies.
 * Host owns timing and calls render({ progress, time, pointerX, pointerY }).
 */
(function (global) {
  'use strict';
  var T = global.THREE;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var smooth = function (a, b, x) { var v = clamp((x - a) / (b - a), 0, 1); return v * v * (3 - 2 * v); };

  function create(canvas) {
    if (!T || !canvas || typeof canvas.getContext !== 'function') return null;
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (_) { return null; }
    var scene, environment, pmrem, disposed = false, width = 1, height = 1, lastProgress = -1;
    var ownedTextures = [], animated = [], geometries = new Set(), materials = new Set();
    var randSeed = 71923;
    function random() { randSeed = (randSeed * 1664525 + 1013904223) >>> 0; return randSeed / 4294967296; }
    function geometry(g) { geometries.add(g); return g; }
    function material(m) { materials.add(m); return m; }
    function mesh(g, m, x, y, z, parent) {
      var object = new T.Mesh(g, m); object.position.set(x || 0, y || 0, z || 0);
      (parent || scene).add(object); return object;
    }
    function roundRect(width, height, radius, hole) {
      var p = hole ? new T.Path() : new T.Shape();
      var x = -width / 2, y = -height / 2, r = radius;
      p.moveTo(x + r, y); p.lineTo(x + width - r, y);
      p.quadraticCurveTo(x + width, y, x + width, y + r);
      p.lineTo(x + width, y + height - r);
      p.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      p.lineTo(x + r, y + height); p.quadraticCurveTo(x, y + height, x, y + height - r);
      p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
      return p;
    }
    function ringGeometry(w, h, border, depth, bevel) {
      var shape = roundRect(w, h, .18, false);
      shape.holes.push(roundRect(w - 2 * border, h - 2 * border, .1, true));
      var g = new T.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: bevel > 0, bevelThickness: bevel,
        bevelSize: bevel, bevelSegments: 3, steps: 1, curveSegments: 5 });
      g.translate(0, 0, -depth / 2); return geometry(g);
    }
    function glowTexture() {
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var ctx = c.getContext('2d'), gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(207,255,241,1)');
      gradient.addColorStop(.09, 'rgba(110,255,219,.88)');
      gradient.addColorStop(.28, 'rgba(18,238,189,.23)');
      gradient.addColorStop(.62, 'rgba(0,150,115,.06)'); gradient.addColorStop(1, 'rgba(0,80,64,0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
      var texture = new T.CanvasTexture(c); texture.colorSpace = T.SRGBColorSpace; ownedTextures.push(texture); return texture;
    }
    function makeEnvironment() {
      var studio = new T.Scene(); studio.background = new T.Color(0x092c21);
      var studioGeometries = [], studioMaterials = [];
      function panel(color, power, w, h, x, y, z, rx, ry) {
        var m = new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(power), side: T.DoubleSide });
        var g = new T.PlaneGeometry(w, h); studioGeometries.push(g); studioMaterials.push(m);
        var p = new T.Mesh(g, m); p.position.set(x,y,z); p.rotation.set(rx || 0,ry || 0,0); studio.add(p);
      }
      panel(0xf0fff9, 3.4, 16, 4, 0, 9, 1, Math.PI / 2, 0);
      panel(0x88ffd9, 2.1, 16, 3, -8, 3, 0, 0, Math.PI / 2);
      panel(0x0ee7bb, 2.5, 19, 2.5, 9, 1, 0, 0, Math.PI / 2);
      panel(0xe8fff4, 2.0, 3, 13, 2, 3, -11, 0, 0);
      panel(0x00100a, 1, 60, 60, 0, -5, 0, Math.PI / 2, 0);
      pmrem = new T.PMREMGenerator(renderer); pmrem.compileCubemapShader();
      environment = pmrem.fromScene(studio, .035, .1, 80);
      studioGeometries.forEach(function(g) { g.dispose(); }); studioMaterials.forEach(function(m) { m.dispose(); });
      pmrem.dispose(); pmrem = null; return environment.texture;
    }
    function cleanUp() {
      if (disposed) return; disposed = true;
      geometries.forEach(function(g) { g.dispose(); }); materials.forEach(function(m) { m.dispose(); });
      ownedTextures.forEach(function(t) { t.dispose(); });
      if (environment) environment.dispose(); if (pmrem) pmrem.dispose();
      if (scene) scene.clear(); if (renderer) renderer.dispose();
    }

    try {
      renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.6));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.16;
      renderer.setClearColor(0x021b15, 1); renderer.sortObjects = true;
      scene = new T.Scene(); scene.background = new T.Color(0x021b15);
      scene.fog = new T.FogExp2(0x021b15, .027);
      var camera = new T.PerspectiveCamera(43, 1, .12, 130);
      camera.position.set(.3, .9, 13.4);
      scene.environment = makeEnvironment();
      scene.add(new T.HemisphereLight(0xd2ffec, 0x021910, 1.15));
      var key = new T.DirectionalLight(0xb3ffe3, 3.2); key.position.set(-5, 12, 8); scene.add(key);
      var rim = new T.DirectionalLight(0x08e1b3, 2.4); rim.position.set(9, 4, -9); scene.add(rim);
      var back = new T.PointLight(0x00ffcd, 34, 28, 2); back.position.set(0, 1.2, -18); scene.add(back);

      var floorY = -3.0;
      var glass = material(new T.MeshPhysicalMaterial({ color: 0x05755b, metalness: .12, roughness: .14,
        transmission: .58, thickness: .72, ior: 1.48, clearcoat: 1, clearcoatRoughness: .08,
        attenuationColor: new T.Color(0x00ad7c), attenuationDistance: 4.3,
        envMapIntensity: 1.65, transparent: true, opacity: .94, depthWrite: false }));
      var slabGlass = material(new T.MeshPhysicalMaterial({ color: 0x025b42, metalness: .12, roughness: .2,
        transmission: .34, thickness: 1.2, ior: 1.47, clearcoat: 1, clearcoatRoughness: .12,
        attenuationColor: new T.Color(0x039771), attenuationDistance: 4, envMapIntensity: 1.75 }));
      var darkGlass = material(new T.MeshPhysicalMaterial({ color: 0x063c2d, metalness: .58, roughness: .24,
        clearcoat: 1, clearcoatRoughness: .09, envMapIntensity: 1.65 }));
      var silver = material(new T.MeshStandardMaterial({ color: 0x70ceb0, metalness: .9, roughness: .19, envMapIntensity: 1.2 }));
      var cyan = material(new T.MeshBasicMaterial({ color: 0x8cffe0, transparent: true, opacity: .85, toneMapped: false }));
      var cyanSoft = material(new T.MeshBasicMaterial({ color: 0x00d9ad, transparent: true, opacity: .3, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
      var edgeMat = material(new T.LineBasicMaterial({ color: 0x2bedc2, transparent: true, opacity: .25, depthWrite: false }));
      var unitBox = geometry(new T.BoxGeometry(1,1,1));
      var portalShape = ringGeometry(8.6, 7.0, .36, .62, .075);
      var portalCore = ringGeometry(8.25, 6.66, .095, .18, .02);
      var portalLip = ringGeometry(7.89, 6.3, .023, .021, .008);
      var portalRim = ringGeometry(8.74, 7.14, .026, .03, .009);
      var frameEdges = geometry(new T.EdgesGeometry(portalShape, 24));
      var glows = [], glowMap = glowTexture();
      var glowMat = material(new T.SpriteMaterial({ map: glowMap, color: 0x7affdc, transparent: true,
        opacity: .55, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
      function glow(x,y,z,sx,sy,opacity,parent) {
        var m = opacity === undefined ? glowMat : material(glowMat.clone());
        if (opacity !== undefined) m.opacity = opacity;
        var object = new T.Sprite(m); object.position.set(x,y,z); object.scale.set(sx,sy || sx,1);
        (parent || scene).add(object); glows.push(object); return object;
      }
      for (var i = 0; i < 12; i++) {
        var portal = new T.Group(); portal.position.set(0,.53,-1.8 - i * 4.35); scene.add(portal);
        mesh(portalShape, glass, 0,0,0,portal);
        mesh(portalCore, darkGlass, 0,0,-.14,portal);
        mesh(portalLip, cyan, 0,0,.366,portal);
        mesh(portalRim, silver, 0,0,.03,portal);
        var edges = new T.LineSegments(frameEdges, edgeMat); portal.add(edges);
        // A broad, local halo gives luminous glass without a full-screen bloom pass.
        glow(-3.95,-3.12,.38,.45,1.8,.28,portal);
        glow(3.95,-3.12,.38,.45,1.8,.28,portal);
        if (i < 7) { glow(-4.12,2.7,.32,.32,1.3,.14,portal); glow(4.12,2.7,.32,.32,1.3,.14,portal); }
        mesh(unitBox,darkGlass,-4.16,-3.32,0,portal).scale.set(.7,.26,1.12);
        mesh(unitBox,darkGlass,4.16,-3.32,0,portal).scale.set(.7,.26,1.12);
        animated.push({object:portal,phase:i*.67});
      }

      // Flanking architecture is built from substantial beveled glass blocks, not wire outlines.
      var blockGeometry = geometry(new T.BoxGeometry(1,1,1));
      var blockEdges = geometry(new T.EdgesGeometry(blockGeometry));
      for (var side = -1; side <= 1; side += 2) {
        for (var j = 0; j < 17; j++) {
          var depth = 1 + random() * 1.6, h = 1.1 + random() * 4.2, w = 1.15 + random() * 1.0;
          var block = new T.Group(); block.position.set(side * (5.1 + random() * 2.35),floorY+h*.5,5-j*3.15);
          block.rotation.y = side * (.04 + random()*.1); scene.add(block);
          var solid = mesh(blockGeometry, j % 4 === 0 ? glass : slabGlass, 0,0,0,block); solid.scale.set(w,h,depth);
          var e = new T.LineSegments(blockEdges, edgeMat); e.scale.copy(solid.scale); block.add(e);
          // Embedded luminous seam and polished cap distinguish fronts and sides.
          mesh(unitBox,cyanSoft,-side*w*.5,h*.17,depth*.51,block).scale.set(.035,h*.46,.012);
          mesh(unitBox,silver,0,h*.5-.026,0,block).scale.set(w,.032,depth);
          mesh(unitBox,darkGlass,0,-h*.5-.14,0,block).scale.set(w+.11,.26,depth+.11);
          if (j % 3 === 0) {
            mesh(unitBox,cyan,0,-h*.23,depth*.52,block).scale.set(w*.25,.018,.013);
            glow(side*(5.1 + random()*1.3),floorY+.13,5-j*3.15,2.6,.6,.22);
          }
        }
      }

      // A dark satin floor anchors perspective; the grid recedes naturally into fog.
      var floorMaterial = material(new T.MeshStandardMaterial({ color:0x03271e, metalness:.72, roughness:.29, envMapIntensity:.62 }));
      var floor = mesh(geometry(new T.PlaneGeometry(150,150)),floorMaterial,0,floorY-.035,-28);
      floor.rotation.x = -Math.PI/2;
      var grid = new T.GridHelper(120,80,0x137557,0x0b624c); grid.position.set(0,floorY,-26);
      grid.material.transparent = true; grid.material.opacity=.27; grid.material.depthWrite=false;
      geometries.add(grid.geometry); materials.add(grid.material); scene.add(grid);
      var runwayMat = material(new T.MeshBasicMaterial({color:0x2fffc5,transparent:true,opacity:.26,depthWrite:false,blending:T.AdditiveBlending}));
      [-3.45,3.45].forEach(function(x){mesh(unitBox,runwayMat,x,floorY+.011,-24).scale.set(.015,.012,78);});
      // Restrained floor reflections are tapered, diffuse pools under each glass frame.
      var poolMat = material(new T.MeshBasicMaterial({map:glowMap,color:0x00bc89,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending}));
      var poolGeometry = geometry(new T.PlaneGeometry(8.3,4.5));
      for(var pool=0;pool<11;pool++){var p=mesh(poolGeometry,poolMat,0,floorY+.006,-1.8-pool*4.35);p.rotation.x=-Math.PI/2;}

      // GPU-efficient point sprites form sparse packets moving along the outer data lanes.
      var count=230, positions=new Float32Array(count*3), seeds=new Float32Array(count);
      for(var k=0;k<count;k++){
        positions[k*3]=(random()<.5?-1:1)*(3.6+random()*4.8);
        positions[k*3+1]=floorY+.12+Math.pow(random(),1.8)*6.2;
        positions[k*3+2]=-58+random()*74; seeds[k]=random();
      }
      var particlesGeometry=geometry(new T.BufferGeometry());
      particlesGeometry.setAttribute('position',new T.BufferAttribute(positions,3));
      particlesGeometry.setAttribute('seed',new T.BufferAttribute(seeds,1));
      var particleMaterial=material(new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        uniforms:{uTime:{value:0},uPixelRatio:{value:renderer.getPixelRatio()}},
        vertexShader:'attribute float seed; uniform float uTime; uniform float uPixelRatio; varying float vAlpha; void main(){vec3 p=position; p.z=mod(p.z+58.0+uTime*(0.48+seed*0.6),74.0)-58.0; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=clamp((1.0+seed*1.5)*115.0/max(1.0,-mv.z),1.0,8.0)*uPixelRatio; vAlpha=(0.25+seed*0.7)*(1.0-smoothstep(10.0,68.0,-mv.z));}',
        fragmentShader:'varying float vAlpha; void main(){float r=length(gl_PointCoord-vec2(0.5)); float a=pow(max(0.0,1.0-r*2.0),2.0)*vAlpha; gl_FragColor=vec4(mix(vec3(0.0,0.72,0.51),vec3(0.73,1.0,0.91),pow(max(0.0,1.0-r*3.0),3.0)),a);}'
      }));
      var particles=new T.Points(particlesGeometry,particleMaterial);particles.frustumCulled=false;scene.add(particles);
      var streams=[];
      for(var stream=0;stream<18;stream++){
        var line=mesh(unitBox,stream%3===0?cyan:cyanSoft,(stream%2?-1:1)*(3.5+(stream%3)*.18),floorY+.035,-stream*3.8);
        line.scale.set(.025,.015,.32+random()*.42);streams.push({object:line,offset:stream*4.11,speed:.72+random()*.7});
      }
      var aim=new T.Vector3();
      function setProjection(progress){
        var offset=width/height>1.2?.19*(1-smooth(0,.30,progress)):0;
        camera.setViewOffset(width,height,-width*offset,0,width,height); camera.updateProjectionMatrix();
      }
      function resize(w,h){
        if(disposed)return;
        width=Math.max(1,Math.round(Number(w)||canvas.clientWidth||1));height=Math.max(1,Math.round(Number(h)||canvas.clientHeight||1));
        camera.aspect=width/height;camera.fov=width/height<.8?55:43;
        renderer.setSize(width,height,false);setProjection(Math.max(0,lastProgress));
      }
      function render(state){
        if(disposed)return false;
        var context=renderer.getContext();if(!context||context.isContextLost())return false;
        state=state||{};var progress=clamp(Number(state.progress)||0,0,1),time=Number(state.time)||0;
        var px=clamp(Number(state.pointerX)||0,-1,1),py=clamp(Number(state.pointerY)||0,-1,1);
        if(progress!==lastProgress){setProjection(progress);lastProgress=progress;}
        var travel=progress*36;
        camera.position.set(.30+px*.28,.90-py*.17,13.4-travel);
        aim.set(px*.08,.49-py*.065,camera.position.z-24);camera.lookAt(aim);
        back.position.z=-18-travel*.55;
        back.intensity=34+Math.sin(time*.7)*2;
        particleMaterial.uniforms.uTime.value=time;
        for(var i=0;i<streams.length;i++){var st=streams[i];st.object.position.z=13-((st.offset+time*st.speed)%74);}
        // Very small breathing in luminance; architecture stays perfectly stable.
        cyanSoft.opacity=.28+Math.sin(time*.6)*.025;
        renderer.render(scene,camera);return true;
      }
      resize(canvas.clientWidth||canvas.width||1,canvas.clientHeight||canvas.height||1);
      // Force shader compilation/first draw here so an unusable GL implementation returns null.
      if (!render({progress:0,time:0,pointerX:0,pointerY:0})) { cleanUp(); return null; }
      return {render:render,resize:resize,dispose:cleanUp};
    } catch(error) {
      cleanUp();
      if(global.console&&global.console.warn)global.console.warn('Vishwa scene unavailable:',error);
      return null;
    }
  }
  global.VishwaScene={create:create};
})(window);
