# iTwin Platform CLI

The **iTwin Platform CLI** is a command-line tool for interacting with the [iTwin Platform](https://developer.bentley.com). It enables automation of common workflows such as managing iTwins and iModels, synchronizing design data, handling storage, and controlling user access.

🚀 **Why use the iTwin Platform CLI?**
- Automate creation of iTwins and iModels, updates and management.
- Streamline design data synchronization and versioning.
- Manage users, roles, and permissions efficiently.
- Automate workflows with scripts, scheduled tasks, and data pipelines.

For a step-by-step guide on getting started with an iTwin, see the **[Quickstart](https://itwin.github.io/itwin-cli/#/quickstart)**. For a complete list of commands and usage examples, visit the **[iTwin Platform CLI Manual](https://itwin.github.io/itwin-cli)**.

## **Getting Started**

### **1. Install the CLI**
Download the latest version for your operating system from the **[Releases](https://github.com/itwin/itwin-cli/releases)** page and install it.

### **2. Authenticate with the iTwin Platform**
Before using the CLI, sign in:
```bash
itp auth login
```

### **3. Run Your First Command**
Check your user details to verify authentication:
```bash
itp user me
```

### **4. Setup Command Autocomplete (Optional)**
Install a plugin and run the added command for further instructions.
NOTE: As of June 16th, 2025 only `bash`, `zsh` and `powershell` are supported.
```bash
itp plugins install @oclif/plugin-autocomplete
itp autocomplete
```
---

## **Contributing**
Interested in improving the iTwin Platform CLI? We welcome contributions! See our **[Contribution Guide](./CONTRIBUTING.md)** for setup instructions, development workflow, and contribution guidelines.

---

## **Support & Feedback**
- 🛠 **Report Issues or Feature Requests**: [GitHub Issues](https://github.com/itwin/itwin-cli/issues)
- 📚 **iTwin Platform Documentation**: [developer.bentley.com](https://developer.bentley.com)

🚀 **Start automating with the iTwin Platform CLI — because efficiency shouldn’t be optional.**
