# Quickstart

The iTwin CLI allows you to interact with the iTwin Platform efficiently. This guide walks you through the essential first steps: **creating an iTwin, setting up an iModel, and populating it with design data.**

## Get Started with the iTwin Platform

### Step 0: Authenticate

Before using the CLI, you must log in to authenticate your session.

```bash
itp auth login
```

**Expected Outcome:** A browser window opens for authentication. Once logged in, your session is ready for authorized interaction with the iTwin Platform.

### Step 1: Create an iTwin

An iTwin represents a **digital twin** that organizes models, repositories, and data sources.

```bash
itp itwin create --class Thing --sub-class Asset --display-name "My First iTwin"
```

**Expected Outcome:** The command returns an *iTwin ID*, which you’ll use in the next steps.

---

### Step 2: Create an iModel

An iModel stores design data and tracks changes over time. To create one, specify the *iTwin ID* from Step 1.

```bash
itp imodel create --itwin-id your-itwin-id --name "My First iModel"
```

**Expected Outcome:** You receive an *iModel ID* for future operations.

---

### Step 3: Populate the iModel with Design Data

Once your iModel is created, synchronize design files into it using the **populate** command.

```bash
itp imodel populate --imodel-id your-imodel-id --file file.dgn
```

**Expected Outcome:** Your design data is now available on the iTwin Platform. You can navigate to [My iTwins](https://developer.bentley.com/my-itwins/) on the iTwin Developer Portal to visualize it.

---

## Next Steps

- 📚 **[Command Reference](itp.md):** Explore all available CLI commands.
- 🔹 **[Workflows](workflows/overview.md):** Step-by-step guides for real-world workflows, including:
  - ⚡ **[Automate iModel updates](workflows/imodel-automate-update.md)**
  - 📂 **[Manage project repositories](workflows/itwin-add-repositories.md)**
  - 🔑 **[Control user permissions](workflows/itwin-group-access.md)**
- 🌍 **[API Documentation](https://developer.bentley.com/apis/#api-references):** Learn about the iTwin Platform APIs.

---

🎉 **Congratulations!** You’ve successfully created an iTwin, set up an iModel, and populated it with data. Now you’re ready to dive deeper into automation and integration!
