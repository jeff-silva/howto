---
name: character-generate
description: Automated workflow to procedurally generate detailed, rigged 3D humanoid characters (.glb) with anatomical face, eyes, and limbs using MPFB (MakeHuman) and Blender inside Docker.
---

# Character Generate Skill (MPFB / MakeHuman Engine)

This skill documents the automated operational workflow to generate realistic and stylized **fully rigged, anatomically accurate 3D humanoid character models (`.glb`)** directly from text prompts using the **MPFB2 (MakeHuman Plugin for Blender)** extension inside a headless Docker container.

---

## 1. Workflow Architecture

```
[Character Description + Target Filename]
                   │
                   ▼
[1. Generate character generator Python script]
(Invokes MPFB HumanService, macro targets, skin materials, facial features, accessories)
                   │
                   ▼
[2. Execute headless Blender with MPFB in Docker]
(Mounts tools/blender-extensions to /root/.config/blender/5.3/extensions)
                   │
                   ▼
[3. Export GLB & Cleanup]
(Saves rigged humanoid directly to src/assets/characters/<filename>.glb and deletes temporary .py)
                   │
                   ▼
[Ready for HyperFrames / Three.js Scene Playback]
```

---

## 2. Input Parameters

1. **`description`**: Character anatomy, age, gender, body build, ethnicity, facial features, and clothing/accessories.
   - Example: *"Latino 9-year-old boy, slim build, green checkered flap cap, brown eyes, skin tone #c79470"*.
2. **`filename`**: Base filename for the generated output `.glb` (e.g. `chaves`, `referee`).
   - Destination path: `/home/jeff/howto/hyperframes/src/assets/characters/<filename>.glb`

---

## 3. Generator Script Specification (`character-generator.py`)

The script utilizes MPFB's built-in services to construct an unbroken, continuous quad mesh rather than disjoint geometric primitives:

```python
import bpy
import sys, importlib, os

# Enable MPFB Extension
bpy.ops.preferences.addon_enable(module="bl_ext.user_default.mpfb")

def dynamic_import(absolute_package_str, key):
    for amod in sys.modules:
        if amod.endswith(absolute_package_str):
            mpfb_mod = importlib.import_module(amod)
            if hasattr(mpfb_mod, key):
                return getattr(mpfb_mod, key)
    raise ValueError(f"No module found with name ending in {absolute_package_str}")

HumanService = dynamic_import("mpfb.services.humanservice", "HumanService")
HumanObjectProperties = dynamic_import("mpfb.entities.objectproperties", "HumanObjectProperties")
TargetService = dynamic_import("mpfb.services.targetservice", "TargetService")

bpy.ops.wm.read_factory_settings(use_empty=True)

# 1. Create anatomical base mesh (full body with facial topology, ears, mouth cavity, fingers)
human = HumanService.create_human()

# 2. Apply Macro-details (Morph Targets)
# Values range from 0.0 to 1.0:
HumanObjectProperties.set_value("age", 0.16, entity_reference=human)       # Child (0.15 - 0.2), Adult (0.5), Elderly (0.8+)
HumanObjectProperties.set_value("gender", 1.0, entity_reference=human)    # 0.0 = Female, 1.0 = Male
HumanObjectProperties.set_value("weight", 0.35, entity_reference=human)   # 0.0 = Skinny, 0.5 = Average, 1.0 = Obese
HumanObjectProperties.set_value("muscle", 0.20, entity_reference=human)   # Muscularity definition
HumanObjectProperties.set_value("caucasian", 0.5, entity_reference=human) # Ethnic blend
HumanObjectProperties.set_value("african", 0.2, entity_reference=human)
HumanObjectProperties.set_value("asian", 0.0, entity_reference=human)

TargetService.reapply_macro_details(human)

# 3. Skin Material (Principled BSDF)
mat_skin = bpy.data.materials.new("CharacterSkin")
mat_skin.use_nodes = True
bsdf = mat_skin.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.78, 0.58, 0.44, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.55

if human.data.materials:
    human.data.materials[0] = mat_skin
else:
    human.data.materials.append(mat_skin)

# 4. Attach Accessories & Custom Items (Parented to the human model)
# E.g., Eyes, Hats, Props

# 5. Add Game Engine / Mixamo compatible Rig
HumanService.add_builtin_rig(human, "game_engine")

# 6. Export to GLB
output_path = "/output/assets/characters/<filename>.glb"
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_animations=True,
    export_skins=True,
    export_materials='EXPORT',
    export_yup=True
)
```

---

## 4. Docker CLI Command

Execute headlessly with MPFB mounted into Blender's user extension path:

```bash
docker run --rm \
  -v /home/jeff/howto/hyperframes/tools/blender-extensions:/root/.config/blender/5.3/extensions \
  -v /home/jeff/howto/hyperframes/src:/output \
  lscr.io/linuxserver/blender:latest \
  blender -b -P /output/character-generator.py && \
  rm -f /home/jeff/howto/hyperframes/src/character-generator.py
```

---

## 5. Three.js Rig Hierarchy (Game Engine Bone Names)

The MPFB `game_engine` rig exports with standard humanoid joint names ready for GSAP or Three.js control:
- **Pelvis**: `pelvis`
- **Spine**: `spine_01`, `spine_02`, `spine_03`, `neck_01`, `head`
- **Arms**: `clavicle_l/r`, `upperarm_l/r`, `lowerarm_l/r`, `hand_l/r`
- **Fingers**: `thumb_01..03`, `index_01..03`, `middle_01..03`, `ring_01..03`, `pinky_01..03`
- **Legs**: `thigh_l/r`, `calf_l/r`, `foot_l/r`, `ball_l/r`
