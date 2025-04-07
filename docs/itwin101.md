# iTwin 101

**A developer-fiendly introduction to Bentley's iTwin Platform.**

The infrastructure industry is rapidly evolving—moving from traditional CAD workflows to dynamic, cloud-connected systems that reflect physical assets in real time. This shift is powered by the rise of digital twins: virtual representations of infrastructure that go beyond static design to provide a live, comprehensive view of how things are built, how they behave, and how they change.

Bentley Systems, a long-standing leader in infrastructure software, has developed the **iTwin Platform** to empower developers, engineers, and organizations to build and manage digital twins at scale. While Bentley’s flagship products, like **MicroStation**, have supported infrastructure design for decades, the iTwin Platform introduces a new, cloud-first approach to project collaboration, data integration, and asset management.

With Bentley's recent acquisition of **Cesium**, the iTwin Platform has gained exciting new capabilities in high-performance, geospatial visualization. The **iTwin CLI** includes features that make it easy to integrate and visualize iTwins in Cesium Sandcastle as part of broader digital twin workflows.

---

### 🎓 What Is a Digital Twin?

A **digital twin** is more than a design model. It’s a cloud-based, real-time digital representation of a physical asset—like a building, bridge, highway, or dam. A digital twin integrates multiple data layers:

- **👩‍🔧 Design Data**: CAD and BIM models created using tools like MicroStation, Revit, AutoCAD, etc.
- **🌍 Reality Data**: Photogrammetry, point clouds, and 3D meshes captured by drones or scanners.
- **📈 Sensor Data**: Live IoT data reflecting asset performance, environmental conditions, and more.
- **📂 External Repositories**: Additional cloud data sources that enrich the digital twin's context.

What makes a digital twin powerful is the way these sources come together in the cloud to form a "living" version of an asset—something that's not just visual, but interactive and analyzable.

---

### 🪧 Enter the iTwin

The **iTwin** is Bentley’s implementation of a digital twin—a central hub that brings together all the data related to an infrastructure asset. It's built to be open, extensible, and deeply interoperable.

At its core, an iTwin includes several key components:

#### 🧱 iModel: Design Data, Standardized

An **iModel** is a specialized cloud repository for 3D design data. It acts as a **common data environment** that unifies models from various design applications (MicroStation, Revit, Civil3D, etc.) into a single, coherent format.

> Have a Revit file for a building? Add it to the iModel.  
> Got utility designs from MicroStation? Add them too.

The iModel isn’t just a storage format—it acts like **Git for infrastructure**. Designers "synchronize" their changes, which are stored as **changesets**. This allows for collaborative workflows, version tracking, and change comparison.

#### 🌎 Reality Data: Contextual Visualization

Drones, scanners, and photogrammetry can capture detailed environmental data around your asset. This is imported into the iTwin to create photorealistic context and increase the accuracy of both design and decision-making.

#### 📊 Sensor Data: Real-Time Awareness

Digital twins aren’t just static snapshots. By integrating sensor or IoT data, iTwins reflect real-world conditions in real time. Think:

- Energy usage
- Equipment performance
- Occupancy levels
- Fault detection

This makes the iTwin a true operational tool, not just a design archive.

#### 📚 External Data: Extendable by Design

Need to connect to a custom database, web API, or document store? The iTwin is designed to consume and present external data as part of its interface. Through widgets, charts, or overlays, the twin can be tailored to meet specific business needs.

---

### ⚙️ The Role of the iTwin CLI

The **iTwin CLI** is a command-line tool that lets developers and technical users interact with the iTwin Platform programmatically. It simplifies many common tasks:

- ✍️ **Create and manage iTwins**
- 🛡️ **Set up access control and user roles**
- 🔍 **Query or inspect metadata**
- 📂 **Create iModels and populate them with design files**
- 📰 **Track and compare changes with changesets**
- 🔢 **Create named versions to mark project milestones**
- ⇄ **Synchronize data into the iModel**
- 🌍 **Visualize the iTwin in Cesium Sandcastle**

It serves as a lightweight, scriptable gateway into a powerful ecosystem.

---

### 🗂️ iModels and Version Control

Think of the iModel like Git. Multiple designers can work in parallel and synchronize changes when ready. Each sync produces a set of **changesets** that are stored with full history. This allows you to:

- 📋 See who made which change
- 🕓 Inspect previous states
- ⚖️ Compare two versions to highlight changed elements

You can also create **named versions** at key milestones: design freeze, regulatory submission, final approval, etc.

This not only supports tracking and review, but also enables advanced automation and visualization possibilities.

---

### 🗃️ Storage and Synchronization

iTwins contain a dedicated storage repository where design files and project documents can be centrally managed. This storage acts as a staging area for incoming files before they're synchronized into an iModel.

The iTwin CLI supports using this shared storage to:

- 📤 Upload and organize design files
- 🔄 Sync them into the iModel
- 📎 Add documents and media (PDFs, photos, drawings)

Files uploaded into iTwin storage can be selectively synchronized using **connections** to control what gets added to the iModel and when.

---

### 🌐 Geospatial Visualization with Cesium

One of the most exciting features of the iTwin CLI is integration with **Cesium Sandcastle**, CesiumJS's interactive 3D globe environment.

> Push your iTwin to Sandcastle and instantly visualize infrastructure assets in a real-world geospatial context.

Design data becomes globally interactive. Combined with reality meshes and IoT data, it opens up new opportunities for:

- High-performance 3D visualization
- Infrastructure analytics
- Immersive design review
- Public or stakeholder presentations

---

### ✨ Wrapping Up

The iTwin CLI makes it easy to build, manage, and explore digital twins using the iTwin Platform. For anyone interested in geospatial technology and digital twin workflows, it opens a new path to work with infrastructure data at scale, integrate diverse data sources, and publish them to a geospatially rich, interactive viewer.

Whether you’re just exploring or already building, the iTwin CLI is your entry point into a next-generation platform for digital infrastructure.

---

**Next up:** [Quickstart Guide →](/docs/quickstart.md)