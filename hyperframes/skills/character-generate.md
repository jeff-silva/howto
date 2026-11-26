---
name: character-generate
description: Automated workflow to procedurally generate stylized, cartoon humanoid 3D characters (.glb) from geometric primitives with a fully articulated rig using headless Blender in Docker.
---

# Stylized Geometric Character Generator (`character-generate`)

This skill documents the automated operational workflow to generate clean, stylized **geometric humanoid character models (`.glb`)** using primary shapes (cubes, spheres, cylinders) combined with an articulated **Armature Rig and Vertex Group Skinning**.

All generation runs headlessly inside a Docker container (`lscr.io/linuxserver/blender:latest`) without installing any tools or libraries on the host machine.

---

## 1. Workflow Architecture

```
[Character Description + Target Filename]
                   │
                   ▼
[1. Generate character-generator.py]
(Defines bones, aligned geometric primitives, PBR materials, and vertex skinning)
                   │
                   ▼
[2. Execute Headless Blender via Docker]
(Runs script and exports rigged .glb to /output/assets/characters/)
                   │
                   ▼
[3. Cleanup & Integration]
(Deletes temporary .py and serves .glb directly to HyperFrames)
```

---

## 2. Input Parameters

1. **`description`**: Character anatomy, proportions (child vs adult, slender vs stout), costume colors, and iconic accessories.
2. **`filename`**: Base filename for the `.glb` model (e.g., `chaves`, `referee`).
   - Final path: `/home/jeff/howto/hyperframes/src/assets/characters/<filename>.glb`

---

## 3. Python Generator Specification (`character-generator.py`)

### 3.1 Armature Hierarchy
Standardized bone names for straightforward GSAP/Three.js animation:
- **`Root`**: Origin `(0, 0, 0)`
- **`Hips`**: Pelvis base
- **`Spine`**: Torso & chest
- **`Neck`** & **`Head`**: Head pivot
- **`UpperArm_{side}`**, **`Forearm_{side}`**, **`Hand_{side}`** (Bilateral `L`/`R`)
- **`UpperLeg_{side}`**, **`LowerLeg_{side}`**, **`Foot_{side}`** (Bilateral `L`/`R`)

### 3.2 Geometry Generation with Vertex Weights
Each geometric part is created at the exact joint location and assigned 100% weight to its driving bone:

```python
import bpy
import math

bpy.ops.wm.read_factory_settings(use_empty=True)

# 1. Create Armature
armature_data = bpy.data.armatures.new("Rig")
armature_obj = bpy.data.objects.new("Armature", armature_data)
bpy.context.collection.objects.link(armature_obj)
bpy.context.view_layer.objects.active = armature_obj

bpy.ops.object.mode_set(mode='EDIT')
eb = armature_data.edit_bones

# Define bones (Root, Hips, Spine, Neck, Head, Limbs...)
# ...
bpy.ops.object.mode_set(mode='OBJECT')

# 2. Material Helper
def make_mat(name, color, rough=0.6):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes.get("Principled BSDF")
    if b:
        b.inputs["Base Color"].default_value = color
        b.inputs["Roughness"].default_value = rough
    return mat

# 3. Add Primitive with Vertex Group
parts = []
def add_part(primitive_type, loc, scale, mat, bone_name):
    if primitive_type == "SPHERE":
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=loc, segments=20, ring_count=14)
    elif primitive_type == "CUBE":
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    elif primitive_type == "CYLINDER":
        bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=1.0, location=loc, vertices=18)
    
    obj = bpy.context.active_object
    obj.scale = scale
    obj.data.materials.append(mat)
    
    vg = obj.vertex_groups.new(name=bone_name)
    vg.add(list(range(len(obj.data.vertices))), 1.0, 'REPLACE')
    parts.append(obj)
    return obj

# 4. Join parts and bind with Armature Modifier
bpy.ops.object.select_all(action='DESELECT')
for p in parts:
    p.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
character_mesh = bpy.context.active_object

mod = character_mesh.modifiers.new(name="ArmatureMod", type='ARMATURE')
mod.object = armature_obj
mod.use_vertex_groups = True
character_mesh.parent = armature_obj

# 5. Export clean GLB
bpy.ops.export_scene.gltf(
    filepath="/output/assets/characters/<filename>.glb",
    export_format='GLB',
    export_animations=True,
    export_skins=True,
    export_materials='EXPORT',
    export_yup=True
)
```

---

## 4. Execution Command in Docker

```bash
docker run --rm \
  -v /home/jeff/howto/hyperframes/src:/output \
  lscr.io/linuxserver/blender:latest \
  blender -b -P /output/character-generator.py && \
  rm -f /home/jeff/howto/hyperframes/src/character-generator.py
```
