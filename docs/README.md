# Welcome to iTwin CLI

This guide will help you get started with the [iTwin CLI](https://github.com/iTwin/itwin-cli) — a command-line tool designed to streamline interactions with the iTwin Platform, manage iTwins and iModels, and automate your digital twin workflows.

> 💡 New to iTwins? Check out our [iTwin 101 guide](itwin101.md) for an introduction to the platform.

## What is the iTwin CLI?

The iTwin CLI enables users to:

- Interact with the iTwin Platform through simple commands
- Create and manage iTwins and iModels for your digital twin projects
- Organize and store data using iTwin storage and repositories
- Manage access control by organizing users, assigning roles, and setting permissions
- Automate data workflows, such as synchronizing design files and tracking changes

Whether you're a first-time user or an experienced developer, this CLI provides essential commands to optimize your iTwin workflows.

---

## Installation

Getting started with the iTwin CLI is quick and easy. Here's how to install it on your system:

1. **Download the Installer**  
   Head over to the [iTwin CLI Releases](https://github.com/iTwin/itwin-cli/releases/latest) page and grab the latest version for your operating system.

2. **Run the Installer**  
   The installation process varies depending on your system:
   - **Windows**: Double-click the `.exe` file and follow the installation wizard.
   - **macOS**: Open the `.pkg` file and complete the installation steps. 
   - **Linux**: Extract the `.tar.gz` file and run:
     ```bash
     sudo ./install.sh
     ```

3. **Verify Your Installation**  
   To make sure everything is set up correctly, open your terminal and run:
   ```bash
   itp --version
   ```
   You should see the version number of your installed CLI. If you get a `command not found` error, you might need to restart your terminal or check your system's PATH.

> 💡 Need help? Visit our [GitHub issues](https://github.com/iTwin/itwin-cli/issues) to get support.

---

## Authentication

Before you can use the iTwin CLI, you'll need to log in. This authenticates your session and allows you to securely interact with the iTwin Platform.

To log in, simply run:
```bash
itp auth login
```

This will open your default browser for authentication. Once you're logged in, your session will remain active, so you won't need to log in again for a while.

To verify your login status, run:
```bash
itp user me
```

This will show your account details, confirming you're properly authenticated.

> 💡 For more specialized authentication workflows, see [itp auth login](auth/login.md).

## Quickstart

Ready to dive in? Our [Quickstart guide](quickstart.md) will walk you through the essential steps:
- Creating your first iTwin
- Setting up an iModel
- Adding design data
- Viewing your model in 3D

Perfect for new users, this guide gets you up and running in minutes.

## Simplify your commands

Want to make your commands shorter and more efficient? Our [Environment guide](environment.md) shows you how to:
- Set default IDs using environment variables
- Save IDs locally using the context system
- Automatically save IDs when creating new iTwins and iModels

This simplifies your workflow and keeps your commands concise.

## Explore common workflows

Ready to tackle real-world scenarios? Our [workflows section](workflows/overview.md) walks you through common use cases:
- ⚡ [Automate iModel updates](workflows/imodel-automate-update.md)
- 📂 [Manage iTwin repositories](workflows/itwin-add-repositories.md)
- 🔑 [Control user permissions](workflows/itwin-group-access.md)
- 📊 [Track project progress](workflows/itwin-script-progress-tracker.md)
- 🔄 [Compare changesets](workflows/imodel-changeset-compare.md)

These guides provide step-by-step instructions for specific tasks and scenarios.
