#!/usr/bin/env node

/**
 * Port Manager for Sentient Factory Monorepo
 * Single source of truth: config/ports.json
 * No redundant .env.ports file
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");

class PortManager {
  constructor() {
    this.configPath = join(ROOT_DIR, "config", "ports.json");
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configData = readFileSync(this.configPath, "utf8");
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error("Error loading port config:", error.message);
      process.exit(1);
    }
  }

  getPort(appName) {
    const appConfig = this.config.apps[appName];
    if (!appConfig) {
      console.error(`App ${appName} not found in config`);
      return null;
    }
    return appConfig.port;
  }

  checkPort(port) {
    try {
      const result = execSync(`lsof -ti:${port}`, { stdio: "pipe" }).toString();
      return result.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  findAvailablePort(startPort) {
    let port = startPort;
    while (this.checkPort(port)) {
      port++;
      if (port > startPort + 100) {
        console.error(
          `Could not find available port starting from ${startPort}`,
        );
        return null;
      }
    }
    return port;
  }

  updatePort(appName, port) {
    const appConfig = this.config.apps[appName];
    if (!appConfig) {
      console.error(`App ${appName} not found`);
      return false;
    }

    appConfig.port = port;
    const configData = JSON.stringify(this.config, null, 2);
    writeFileSync(this.configPath, configData);

    console.log(`✅ Updated ${appName} port to ${port} in config/ports.json`);
    return true;
  }

  toggleActive(appName) {
    const appConfig = this.config.apps[appName];
    if (!appConfig) {
      console.error(`App ${appName} not found`);
      return false;
    }

    appConfig.isActive = !appConfig.isActive;
    const configData = JSON.stringify(this.config, null, 2);
    writeFileSync(this.configPath, configData);

    const status = appConfig.isActive ? "ACTIVE" : "INACTIVE";
    console.log(`✅ Toggled ${appName} to ${status} in config/ports.json`);
    return true;
  }

  setActive(appName, active) {
    const appConfig = this.config.apps[appName];
    if (!appConfig) {
      console.error(`App ${appName} not found`);
      return false;
    }

    appConfig.isActive = active === "true" || active === true;
    const configData = JSON.stringify(this.config, null, 2);
    writeFileSync(this.configPath, configData);

    const status = appConfig.isActive ? "ACTIVE" : "INACTIVE";
    console.log(`✅ Set ${appName} to ${status} in config/ports.json`);
    return true;
  }

  listPorts() {
    console.log("\n📊 Port Configuration for Sentient Factory\n");
    console.log("Applications:");
    console.log("─────────────");

    Object.entries(this.config.apps).forEach(([key, app]) => {
      const port = this.getPort(key);
      const inUse = this.checkPort(port) ? "🔴 IN USE" : "🟢 AVAILABLE";
      const activeStatus = app.isActive ? "✅ ACTIVE" : "⏸️  INACTIVE";
      console.log(`  ${app.name} (${activeStatus})`);
      console.log(`    Port: ${port} (${inUse})`);
      console.log(`    Type: ${app.type}`);
      console.log(`    Env Var: ${app.envVar}`);
      console.log(`    Desc: ${app.description}`);
      console.log();
    });

    console.log("Services:");
    console.log("─────────");
    Object.entries(this.config.services).forEach(([key, service]) => {
      const activeStatus = service.isActive ? "✅" : "⏸️";
      console.log(`  ${service.name || key}: ${service.port} ${activeStatus}`);
    });
  }

  generateEnvVars() {
    console.log("\n🌐 Environment Variables (copy to shell):\n");

    Object.entries(this.config.apps).forEach(([key, app]) => {
      const port = this.getPort(key);
      console.log(`# ${app.name}`);
      console.log(`export ${app.envVar}=${port}`);

      if (app.type === "nextjs") {
        console.log(`export NEXT_PUBLIC_${app.envVar}=${port}`);
      }
      console.log();
    });
  }

  generateStartCommands() {
    console.log("\n🚀 Start Commands (Active Apps Only):\n");

    Object.entries(this.config.apps).forEach(([key, app]) => {
      if (app.isActive) {
        const port = this.getPort(key);
        const dir = `apps/${key}`;

        console.log(`# ${app.name}`);
        console.log(`cd ${dir}`);
        console.log(`${app.envVar}=${port} npm run dev\n`);
      }
    });
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

const portManager = new PortManager();

switch (command) {
  case "list":
  case "ls":
    portManager.listPorts();
    break;

  case "check":
    const appName = args[1];
    if (!appName) {
      console.error("Usage: node scripts/port-manager.js check <app-name>");
      process.exit(1);
    }
    const port = portManager.getPort(appName);
    if (port) {
      const inUse = portManager.checkPort(port);
      console.log(
        `Port ${port} for ${appName} is ${inUse ? "IN USE" : "AVAILABLE"}`,
      );
    }
    break;

  case "find":
    const startPort = parseInt(args[1] || "3000", 10);
    const availablePort = portManager.findAvailablePort(startPort);
    if (availablePort) {
      console.log(`Available port found: ${availablePort}`);
    }
    break;

  case "update":
    const updateApp = args[1];
    const newPort = parseInt(args[2], 10);
    if (!updateApp || !newPort) {
      console.error(
        "Usage: node scripts/port-manager.js update <app-name> <port>",
      );
      process.exit(1);
    }
    portManager.updatePort(updateApp, newPort);
    break;

  case "toggle":
    const toggleApp = args[1];
    if (!toggleApp) {
      console.error("Usage: node scripts/port-manager.js toggle <app-name>");
      process.exit(1);
    }
    portManager.toggleActive(toggleApp);
    break;

  case "active":
    const activeApp = args[1];
    const activeStatus = args[2];
    if (!activeApp || !activeStatus) {
      console.error(
        "Usage: node scripts/port-manager.js active <app-name> <true|false>",
      );
      process.exit(1);
    }
    portManager.setActive(activeApp, activeStatus);
    break;

  case "env":
    portManager.generateEnvVars();
    break;

  case "commands":
    portManager.generateStartCommands();
    break;

  case "help":
  default:
    console.log(`
Port Manager for Sentient Factory Monorepo
Single Source of Truth: config/ports.json

Usage:
  node scripts/port-manager.js <command> [options]

Commands:
  list, ls           List all port configurations
  check <app>        Check if port for app is available
  find [start-port]  Find available port starting from specified port
  update <app> <port> Update port for app in config/ports.json
  toggle <app>       Toggle active status of app
  active <app> <true|false> Set active status of app
  env                Generate environment variables
  commands           Generate start commands for active apps
  help               Show this help message

Examples:
  node scripts/port-manager.js list
  node scripts/port-manager.js check web-dashboard
  node scripts/port-manager.js update web-dashboard 3101
  node scripts/port-manager.js env
    `);
    break;
}
