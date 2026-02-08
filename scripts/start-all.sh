#!/bin/bash

# Start all applications in the monorepo with configured ports
# Single source of truth: config/ports.json

set -e

echo "Starting Sentient Factory applications..."
echo "=========================================="

# Load port configuration from config/ports.json
CONFIG_FILE="config/ports.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Config file not found: $CONFIG_FILE"
    exit 1
fi

# Function to get port from config
get_port() {
    local app_key=$1
    node -e "
        const config = require('../config/ports.json');
        const app = config.apps['$app_key'];
        if (app) {
            console.log(app.port);
        } else {
            console.error('App $app_key not found in config');
            process.exit(1);
        }
    "
}

# Function to get env var name from config
get_env_var() {
    local app_key=$1
    node -e "
        const config = require('../config/ports.json');
        const app = config.apps['$app_key'];
        if (app) {
            console.log(app.envVar);
        } else {
            console.error('App $app_key not found in config');
            process.exit(1);
        }
    "
}

# Function to check if app is active
is_app_active() {
    local app_key=$1
    node -e "
        const config = require('../config/ports.json');
        const app = config.apps['$app_key'];
        if (app) {
            console.log(app.isActive === true ? 'true' : 'false');
        } else {
            console.log('false');
        }
    "
}

# Function to check if port is in use
check_port() {
    local port=$1
    local app=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use for $app"
        return 1
    fi
    return 0
}

# Start applications in background
start_app() {
    local app_key=$1
    local app_name=$2
    
    # Check if app is active
    local is_active=$(is_app_active "$app_key")
    if [ "$is_active" != "true" ]; then
        echo "⏸️  Skipping $app_name (inactive)"
        return 0
    fi
    
    # Get port and env var from config
    local port=$(get_port "$app_key")
    local env_var=$(get_env_var "$app_key")
    local app_dir="apps/$app_key"
    
    if [ -z "$port" ]; then
        echo "❌ Port not configured for $app_name"
        return 1
    fi
    
    if check_port $port "$app_name"; then
        echo "🚀 Starting $app_name on port $port..."
        
        if [ -d "$app_dir" ]; then
            cd "$app_dir"
            
            # Set environment variable and start
            export $env_var=$port
            
            # For Next.js apps, also set NEXT_PUBLIC_ variable
            if [[ "$app_key" == "web-dashboard" || "$app_key" == "landing-page" ]]; then
                export NEXT_PUBLIC_$env_var=$port
            fi
            
            npm run dev &
            local pid=$!
            cd - > /dev/null
            echo "✅ $app_name started (PID: $pid) on port $port"
            return 0
        else
            echo "⚠️  Directory not found: $app_dir"
            return 1
        fi
    else
        echo "❌ Failed to start $app_name - port $port is in use"
        return 1
    fi
}

# Start all applications
echo ""
echo "1. Web Dashboard..."
start_app "web-dashboard" "Web Dashboard"

echo ""
echo "2. Landing Page..."
start_app "landing-page" "Landing Page"

echo ""
echo "3. API Gateway..."
if [ -d "apps/api-gateway" ]; then
    start_app "api-gateway" "API Gateway"
else
    echo "⚠️  API Gateway directory not found, skipping..."
fi

echo ""
echo "4. AI Engine..."
if [ -d "apps/ai-engine" ]; then
    start_app "ai-engine" "AI Engine"
else
    echo "⚠️  AI Engine directory not found, skipping..."
fi

echo ""
echo "5. Documentation..."
if [ -d "docs" ]; then
    doc_port=$(node -e "const config = require('./config/ports.json'); console.log(config.services.docs.port);")
    doc_active=$(node -e "const config = require('./config/ports.json'); console.log(config.services.docs.isActive === true ? 'true' : 'false');")
    
    if [ "$doc_active" = "true" ]; then
        if check_port $doc_port "Documentation"; then
            echo "📚 Starting documentation on port $doc_port..."
            cd docs
            PORT=$doc_port npm run start &
            cd - > /dev/null
            echo "✅ Documentation started (PID: $!)"
        else
            echo "❌ Documentation port $doc_port is in use"
        fi
    else
        echo "⏸️  Skipping Documentation (inactive)"
    fi
else
    echo "⚠️  Documentation directory not found, skipping..."
fi

echo ""
echo "=========================================="
echo "All applications started!"
echo ""
echo "Access URLs:"

# Display URLs
web_port=$(get_port "web-dashboard")
landing_port=$(get_port "landing-page")
api_port=$(get_port "api-gateway")
ai_port=$(get_port "ai-engine")
doc_port=$(node -e "const config = require('./config/ports.json'); console.log(config.services.docs.port);" 2>/dev/null || echo "")

echo "  • Web Dashboard:    http://localhost:$web_port"
echo "  • Landing Page:     http://localhost:$landing_port"
[ -n "$api_port" ] && echo "  • API Gateway:      http://localhost:$api_port"
[ -n "$ai_port" ] && echo "  • AI Engine:        http://localhost:$ai_port"
[ -n "$doc_port" ] && echo "  • Documentation:    http://localhost:$doc_port"
echo ""
echo "Press Ctrl+C to stop all applications"
echo ""

# Wait for Ctrl+C
trap 'echo ""; echo "Stopping all applications..."; kill $(jobs -p); wait; echo "All applications stopped."' INT

# Keep script running
wait