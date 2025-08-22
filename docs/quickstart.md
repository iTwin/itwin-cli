# Quickstart

The iTwin CLI allows you to interact with the iTwin Platform efficiently. This guide walks you through the essential first steps: **creating an iTwin, setting up an iModel, and populating it with design data.**

> 💡 New to iTwins? Check out our [iTwin 101 guide](itwin101.md) for an introduction to the platform.

## Get Started with the iTwin Platform

### Step 0: Authenticate

Before using the CLI, you must log in to authenticate your session.

```bash
itp auth login
```

**Result:** A browser window opens for authentication. Once logged in, your session is ready for authorized interaction with the iTwin Platform.

### Step 1: Create an iTwin

An iTwin represents a **digital twin** that organizes models, repositories, and data sources. We'll use the `--save` flag to store the iTwin ID for future commands.

```bash
itp itwin create --class Thing --sub-class Asset --name "My First iTwin" --save
```

**Result:** The command returns an *iTwin ID* and automatically saves it for future use. You won't need to specify this ID in subsequent commands.

### Step 2: Create an iModel

An iModel stores design data and tracks changes over time. We'll create one within our iTwin, and once again use the `--save` flag to store its ID for future commands.

> Need a design file? Feel free to use the examples provided in the [iTwin CLI repository](https://github.com/iTwin/itwin-cli/tree/main/examples/datasets).

```bash
itp imodel create --name "My First iModel" --save
```

**Result:** You receive an *iModel ID* which is automatically saved for future use.

### Step 3: Populate the iModel with Design Data

The populate command populates an iModel with design data from a given set of files. Since we already saved our iModel ID, we only need to specify the source file(s).

```bash
itp imodel populate --file file.dgn
```

**Result:** Your design data is now available on the iTwin Platform. You can navigate to [My iTwins](https://developer.bentley.com/my-itwins/) on the iTwin Developer Portal to visualize it.

### Step 4: View in Cesium Sandcastle (Bonus)

Want to view your iModel in 3D? The CLI opens it on Cesium, where you can explore it in a geospatial environment.

```bash
itp imodel view cesium-sandcastle --open
```

**Result:** Your default browser opens with your iModel data displayed in 3D global context. You can orbit, zoom, and explore your design data in a rich geospatial environment.

> 💡 Learn more about managing your iTwin and iModel IDs in our [Environment guide](environment.md).

## Next Steps

- 📚 **[Command Reference](itp.md):** Explore all available CLI commands.
- 🔹 **[Workflows](workflows/overview.md):** Step-by-step guides for real-world workflows, including:
  - ⚡ **[Automate iModel updates](workflows/imodel-automate-update.md)**
  - 📂 **[Manage project repositories](workflows/itwin-add-repositories.md)**
  - 🔑 **[Control user permissions](workflows/itwin-group-access.md)**
- 🌍 **[API Documentation](https://developer.bentley.com/apis/#api-references):** Learn about the iTwin Platform APIs.

---

🎉 **Congratulations!** You've successfully created an iTwin, set up an iModel, populated it with data, and even viewed it in 3D. Now you're ready to dive deeper into iTwin workflows and automation!
