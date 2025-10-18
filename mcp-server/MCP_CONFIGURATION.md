# MCP Server Configuration Guide

## Configuration Files

The MCP server can be configured in multiple ways depending on how you want to use it.

### 1. Local Configuration File (mcp-config.json)

Located in the `mcp-server/` directory, this file is used for local testing and development.

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

### 2. Claude Desktop Configuration

For use with Claude Desktop, you need to add the configuration to Claude's config file.

#### Windows

Location: `%APPDATA%\Claude\claude_desktop_config.json`

Full path example: `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`

#### macOS

Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Linux

Location: `~/.config/Claude/claude_desktop_config.json`

### Configuration Examples

#### Option 1: Using Absolute Path (Recommended)

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

**Important**: Replace `D:\\ProgrammingProjects\\mcp-with-api` with your actual project path.

#### Option 2: Using npm Script

If you prefer, you can also run it via npm:

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server",
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

#### Option 3: Multiple MCP Servers

You can configure multiple MCP servers:

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    },
    "another-mcp-server": {
      "command": "node",
      "args": ["path/to/another/server.js"]
    }
  }
}
```

## Environment Variables

### API_BASE_URL

- **Default**: `http://localhost:3000/api`
- **Purpose**: The base URL of your NestJS API
- **Example**: If your API runs on a different port or host, change this:
  ```json
  "env": {
    "API_BASE_URL": "http://localhost:8080/api"
  }
  ```

### NODE_ENV

- **Optional**: Set to `development` or `production`
- **Example**:
  ```json
  "env": {
    "API_BASE_URL": "http://localhost:3000/api",
    "NODE_ENV": "development"
  }
  ```

## Setup Steps

### Step 1: Build the MCP Server

Before using the MCP server, you must build it:

```bash
cd mcp-server
npm install
npm run build
```

This creates the `dist/index.js` file that the configuration points to.

### Step 2: Find Your Project Path

**Windows (PowerShell)**:

```powershell
cd D:\ProgrammingProjects\mcp-with-api\mcp-server
pwd
```

**Windows (Command Prompt)**:

```cmd
cd D:\ProgrammingProjects\mcp-with-api\mcp-server
cd
```

**macOS/Linux**:

```bash
cd /path/to/mcp-with-api/mcp-server
pwd
```

Copy the full path displayed.

### Step 3: Update Claude Desktop Config

1. **Open the config file**:
   - Windows: Open `%APPDATA%\Claude\claude_desktop_config.json` in a text editor
   - macOS: Open `~/Library/Application Support/Claude/claude_desktop_config.json`

2. **Add or update the configuration** with your project path:

   ```json
   {
     "mcpServers": {
       "mcp-api-server": {
         "command": "node",
         "args": ["YOUR_PROJECT_PATH\\mcp-server\\dist\\index.js"],
         "env": {
           "API_BASE_URL": "http://localhost:3000/api"
         }
       }
     }
   }
   ```

3. **Save the file**

4. **Restart Claude Desktop** completely (quit and reopen)

### Step 4: Verify Configuration

In Claude Desktop, ask:

```
"What MCP tools do you have available?"
```

You should see the 12 API tools listed.

## Troubleshooting Configuration Issues

### Issue: "MCP server not found"

**Solution**:

1. Verify the path in the config is absolute (full path)
2. Check that `dist/index.js` exists:
   ```bash
   cd mcp-server
   ls dist/index.js  # macOS/Linux
   dir dist\index.js  # Windows
   ```
3. If missing, rebuild: `npm run build`

### Issue: "Cannot find module"

**Solution**:

1. Make sure you ran `npm install` in the `mcp-server` directory
2. Verify `node_modules` exists
3. Try reinstalling:
   ```bash
   cd mcp-server
   rm -rf node_modules  # macOS/Linux
   rmdir /s node_modules  # Windows
   npm install
   npm run build
   ```

### Issue: "Connection refused" or API errors

**Solution**:

1. Make sure the NestJS API is running:
   ```bash
   # In the main project directory
   npm run start:dev
   ```
2. Test the API directly in a browser:
   - http://localhost:3000/api/products
3. If the API runs on a different port, update the `API_BASE_URL` in the config

### Issue: Tools don't appear in Claude

**Solution**:

1. Check Claude Desktop logs (usually in the same folder as the config file)
2. Look for error messages about the MCP server
3. Verify the config JSON is valid (use a JSON validator)
4. Make sure you completely quit and restarted Claude Desktop

### Issue: Windows path format

**Windows paths must use double backslashes** in JSON:

❌ Wrong:

```json
"args": ["C:\Users\Name\project\mcp-server\dist\index.js"]
```

✅ Correct:

```json
"args": ["C:\\Users\\Name\\project\\mcp-server\\dist\\index.js"]
```

Or use forward slashes:

```json
"args": ["C:/Users/Name/project/mcp-server/dist/index.js"]
```

## Testing the MCP Server Locally

You can test the MCP server without Claude Desktop using the MCP Inspector:

### Install MCP Inspector

```bash
npm install -g @modelcontextprotocol/inspector
```

### Run the Inspector

```bash
cd mcp-server
mcp-inspector node dist/index.js
```

This opens a web interface to test your MCP tools.

## Configuration Best Practices

1. **Use absolute paths** - More reliable than relative paths
2. **Set environment variables** - Keep configuration flexible
3. **Document your setup** - Note your specific paths and settings
4. **Version control** - Don't commit Claude Desktop config (it's user-specific)
5. **Test after changes** - Always restart Claude Desktop after config changes

## Quick Reference

### Windows Example Config

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

### macOS Example Config

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "/Users/username/projects/mcp-with-api/mcp-server/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

## Files Reference

- **Project Root**: `mcp-config.json` - Example config for reference
- **MCP Server**: `mcp-server/mcp-config.json` - Local testing config
- **Claude Desktop**: Platform-specific location (see above)

## Need Help?

If you're still having issues:

1. Check that `npm run build` completed successfully
2. Verify the API is accessible: http://localhost:3000/api/products
3. Check Claude Desktop logs for specific error messages
4. Try the MCP Inspector for debugging
