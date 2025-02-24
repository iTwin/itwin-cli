# Contributing to iTwin CLI

Welcome, and thank you for your interest in contributing to the **iTwin CLI**! 🚀  
There are many ways to contribute, from reporting bugs and suggesting improvements to submitting pull requests.

---

## **Providing Feedback & Reporting Issues**
Your feedback is essential to improving the iTwin CLI. If you've found a bug or have a feature request, please report it.

### **1. Check for Existing Issues**
Before creating a new issue, search the [open issues](https://github.com/iTwin/itwin-cli/issues) to see if it has already been reported. If you find a similar issue:
- **👍 Upvote** to indicate you're also experiencing it.
- **💬 Add relevant comments** to provide more context.

If no existing issue matches your problem, create a new issue.

### **2. Submitting a Good Bug Report**
To help us reproduce and resolve the issue efficiently, include:
- **A clear title and description**
- **Steps to reproduce** the issue
- **Expected vs. actual behavior**
- **Screenshots, logs, or error messages** (if applicable)
- **CLI version and environment details**

[Open an Issue](https://github.com/iTwin/itwin-cli/issues/new/choose)

---

## **Contributing Code**
We’d love to accept your contributions! Follow these steps to get started:

### **1. Set Up Your Development Environment**
#### **Clone the Repository**
```bash
git clone https://github.com/itwin/itwin-cli.git
cd itwin-cli
```
#### **Install Dependencies**
```bash
npm ci
```
#### **Run the CLI in Development Mode**
- **Windows**:
  ```bash
  ./bin/dev [command]
  ```
- **Linux/macOS** (First, make the scripts executable):
  ```bash
  chmod +x ./bin/dev.js
  ./bin/dev.js [command]
  ```

### **2. Create a Branch**
```bash
git checkout -b [your-username]/your-feature-name
```
Example:
```bash
git checkout -b johndoe/add-auth-command
```

### **3. Make Your Changes**
- Follow existing code patterns and structure.
- Write clear commit messages.

### **4. Commit Your Changes**
```bash
git commit -m "Add detailed description of your changes"
```

### **5. Push Your Branch**
```bash
git push origin [your-username]/your-feature-name
```

### **6. Submit a Pull Request**
- Go to the [iTwin CLI GitHub Repository](https://github.com/itwin/itwin-cli).
- Click **New Pull Request**.
- Select your branch and submit your changes for review.

---

## **Contributor License Agreement (CLA)**
A [Contributor License Agreement](https://gist.github.com/imodeljs-admin/9a071844d3a8d420092b5cf360e978ca) with Bentley must be signed before contributions can be accepted. Upon opening a pull request, you will be prompted to use [cla-assistant](https://cla-assistant.io/) for one-time acceptance.

---

## **Best Practices**
✅ **Write Clear Commit Messages** – Describe what your change does and why.  
✅ **Keep Pull Requests Focused** – One issue per PR makes reviews easier.  
✅ **Follow Code Standards** – Match the project’s formatting and structure.  
✅ **Stay Engaged** – Monitor your PR for feedback and respond to requested changes.

---

## **Support & Questions**
- 🛠 **Report Issues or Feature Requests**: [GitHub Issues](https://github.com/itwin/itwin-cli/issues)  
- 📚 **Learn More About iTwins**: [developer.bentley.com](https://developer.bentley.com)

Thank you for helping improve the iTwin CLI! 🚀
