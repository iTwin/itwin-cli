# iTwin CLI Manual

Welcome to the **iTwin CLI Manual**. This guide will help you get started with the iTwin CLI, a command-line tool designed to automate workflows, manage iTwins and iModels, and streamline interactions with the iTwin Platform.

## What is the iTwin CLI?

The iTwin CLI enables users to:

- Create and manage iTwins and iModels for digital twin projects.
- Automate data workflows, such as synchronizing design files and tracking changes.
- Manage access control by organizing users, assigning roles, and setting permissions.
- Organize and store data within iTwin storage and repositories.

Whether you're a first-time user or an experienced developer, this CLI provides essential commands to optimize your iTwin workflows.

---

## Installation

To install the iTwin CLI, follow these steps:

1. **Download the Installer**  
   Visit the [iTwin CLI Releases](https://github.com/itwin/itwin-cli/releases) page and download the latest version for your operating system.

2. **Run the Installer**  
   - **Windows**: Run the `.exe` file and follow the prompts.  
   - **macOS**: Open the `.pkg` file to install.  
   - **Linux**: Extract the `.tar.gz` file and run:
     ```bash
     sudo ./install.sh
     ```

3. **Verify Installation**  
   After installation, check if the CLI is set up correctly:
   ```bash
   itp --version
   ```
   This should display the installed version.

---

## Authentication

Before using the iTwin CLI, authenticate your session.

Use the following command to log in:
```bash
itp auth login
```

This will open a browser window for authentication. Once logged in, your session will remain active, allowing you to execute authenticated commands.

To check if you’re logged in, run:
```bash
itp user me
```

This will display your account details.

---

## Quickstart

If you're new to the iTwin CLI, check out the **[Quickstart](quickstart.md)** for a step-by-step walkthrough of setting up an iTwin, creating an iModel, and adding design data.
