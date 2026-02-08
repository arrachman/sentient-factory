# API Examples

## Overview

This document provides practical examples of using the Sentient Factory API with various programming languages and tools.

## Authentication Examples

### JavaScript/Node.js

```javascript
const axios = require("axios");

const API_BASE = "https://api.sentientfactory.com/v1";
let authToken = null;

// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });

    authToken = response.data.data.token;
    console.log("Login successful:", response.data.data.user);
    return response.data.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.error?.message);
    throw error;
  }
}

// Create authenticated axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired, attempting refresh...");
      // Implement token refresh logic here
    }
    return Promise.reject(error);
  },
);
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class SentientFactoryClient:
    def __init__(self, base_url: str = "https://api.sentientfactory.com/v1"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json"
        })

    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate and get JWT token"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": email,
            "password": password
        }

        response = self.session.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        self.token = data["data"]["token"]
        self.session.headers.update({
            "Authorization": f"Bearer {self.token}"
        })

        print(f"Login successful: {data['data']['user']['email']}")
        return data["data"]

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make authenticated request"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()

        return response.json()

    def get(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        return self._make_request("GET", endpoint, **kwargs)

    def post(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        return self._make_request("POST", endpoint, **kwargs)

    def put(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        return self._make_request("PUT", endpoint, **kwargs)

    def delete(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        return self._make_request("DELETE", endpoint, **kwargs)

# Usage
client = SentientFactoryClient()
client.login("user@example.com", "password123")
```

### cURL

```bash
# Login and get token
curl -X POST https://api.sentientfactory.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Save token to variable
TOKEN=$(curl -s -X POST https://api.sentientfactory.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Use token for authenticated requests
curl -X GET https://api.sentientfactory.com/v1/factories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## Factory Management Examples

### Create a Factory (JavaScript)

```javascript
async function createFactory(factoryData) {
  try {
    const response = await apiClient.post("/factories", factoryData);

    console.log("Factory created:", response.data.data.factory);
    return response.data.data.factory;
  } catch (error) {
    console.error("Failed to create factory:", error.response?.data?.error);
    throw error;
  }
}

// Usage
const newFactory = await createFactory({
  name: "Smart Manufacturing Plant",
  location: "789 Innovation Drive, Tech City",
  type: "manufacturing",
  capacity: 2000,
  description: "State-of-the-art manufacturing facility with IoT integration",
  config: {
    timezone: "America/Los_Angeles",
    units: "metric",
    workingHours: {
      start: "06:00",
      end: "22:00",
    },
  },
});
```

### List Factories with Pagination (Python)

```python
def list_factories(page: int = 1, limit: int = 20, status: str = None):
    """List factories with pagination and filtering"""
    params = {
        "page": page,
        "limit": limit
    }

    if status:
        params["status"] = status

    response = client.get("/factories", params=params)

    factories = response["data"]["factories"]
    pagination = response["data"]["pagination"]

    print(f"Page {pagination['page']} of {pagination['pages']}")
    print(f"Total factories: {pagination['total']}")

    for factory in factories:
        print(f"- {factory['name']} ({factory['status']})")

    return factories

# Usage
factories = list_factories(page=1, status="active")
```

### Update Factory (cURL)

```bash
# Update factory information
curl -X PUT https://api.sentientfactory.com/v1/factories/factory_123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Factory Name",
    "capacity": 1500,
    "config": {
      "workingHours": {
        "start": "07:00",
        "end": "19:00"
      }
    }
  }'
```

## Production Line Examples

### Create Production Line (JavaScript)

```javascript
async function createProductionLine(factoryId, lineData) {
  try {
    const response = await apiClient.post(
      `/factories/${factoryId}/production-lines`,
      lineData,
    );

    console.log("Production line created:", response.data.data.productionLine);
    return response.data.data.productionLine;
  } catch (error) {
    console.error(
      "Failed to create production line:",
      error.response?.data?.error,
    );
    throw error;
  }
}

// Usage
const newLine = await createProductionLine("factory_123", {
  name: "High-Speed Assembly Line",
  type: "assembly",
  capacity: 300,
  config: {
    speed: "high",
    automationLevel: "full",
    qualityThreshold: 98.5,
    maintenanceSchedule: "weekly",
  },
});
```

### Monitor Production Line Metrics (Python)

```python
def monitor_production_line(line_id: str, interval_seconds: int = 30):
    """Continuously monitor production line metrics"""
    import time
    from datetime import datetime

    print(f"Starting monitoring for production line {line_id}")
    print("Press Ctrl+C to stop\n")

    try:
        while True:
            response = client.get(f"/production-lines/{line_id}")
            line = response["data"]["productionLine"]
            metrics = line.get("metrics", {})

            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] Line: {line['name']}")
            print(f"  Output: {metrics.get('currentOutput', 0)}/{line['capacity']}")
            print(f"  Efficiency: {metrics.get('efficiency', 0)}%")
            print(f"  Quality: {metrics.get('qualityScore', 0)}%")
            print(f"  Status: {line['status']}")
            print("-" * 40)

            time.sleep(interval_seconds)

    except KeyboardInterrupt:
        print("\nMonitoring stopped")
    except Exception as e:
        print(f"Error: {e}")

# Usage
monitor_production_line("line_123", interval_seconds=60)
```

## Sensor Data Examples

### Ingest Sensor Data (JavaScript)

```javascript
class SensorDataIngestor {
  constructor() {
    this.batchSize = 100;
    this.batch = [];
    this.ingestionInterval = 5000; // 5 seconds
  }

  addReading(sensorId, value, quality = 1.0) {
    const reading = {
      sensorId,
      timestamp: new Date().toISOString(),
      value,
      quality,
    };

    this.batch.push(reading);

    // Auto-ingest when batch is full
    if (this.batch.length >= this.batchSize) {
      this.ingestBatch();
    }
  }

  async ingestBatch() {
    if (this.batch.length === 0) return;

    const batchToSend = [...this.batch];
    this.batch = [];

    try {
      const response = await apiClient.post("/sensors/data", {
        readings: batchToSend,
      });

      console.log(`Ingested ${batchToSend.length} readings`);
      return response.data;
    } catch (error) {
      console.error(
        "Failed to ingest sensor data:",
        error.response?.data?.error,
      );
      // Retry logic could be added here
      throw error;
    }
  }

  startAutoIngestion() {
    this.ingestionTimer = setInterval(() => {
      this.ingestBatch();
    }, this.ingestionInterval);
  }

  stopAutoIngestion() {
    if (this.ingestionTimer) {
      clearInterval(this.ingestionTimer);
    }
    // Ingest any remaining data
    this.ingestBatch();
  }
}

// Usage
const ingestor = new SensorDataIngestor();

// Simulate sensor readings
setInterval(() => {
  ingestor.addReading("TEMP-001", 25 + Math.random() * 2, 0.95);
  ingestor.addReading("PRESSURE-001", 100 + Math.random() * 10, 0.98);
}, 1000);

ingestor.startAutoIngestion();
```

### Query Historical Sensor Data (Python)

```python
def get_sensor_history(sensor_id: str, start_time: str, end_time: str, interval: str = "5m"):
    """Get historical sensor data with aggregation"""
    import pandas as pd
    from datetime import datetime, timedelta

    params = {
        "start": start_time,
        "end": end_time,
        "interval": interval
    }

    response = client.get(f"/sensors/{sensor_id}/data", params=params)

    data = response["data"]
    readings = data["readings"]

    # Convert to pandas DataFrame for analysis
    df = pd.DataFrame(readings)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df.set_index("timestamp", inplace=True)

    print(f"Retrieved {len(df)} data points")
    print(f"Time range: {df.index.min()} to {df.index.max()}")
    print(f"Average value: {df['value'].mean():.2f}")
    print(f"Standard deviation: {df['value'].std():.2f}")

    # Calculate additional statistics
    summary = {
        "sensor": data["sensor"]["name"],
        "count": len(df),
        "mean": df["value"].mean(),
        "min": df["value"].min(),
        "max": df["value"].max(),
        "std": df["value"].std(),
        "quality_avg": df["quality"].mean()
    }

    return df, summary

# Usage
start_time = "2024-01-15T00:00:00Z"
end_time = "2024-01-15T23:59:59Z"

df, stats = get_sensor_history(
    sensor_id="sensor_123",
    start_time=start_time,
    end_time=end_time,
    interval="1h"
)

print("\nStatistics:")
for key, value in stats.items():
    print(f"{key}: {value}")
```

## AI Prediction Examples

### Request Quality Prediction (JavaScript)

```javascript
async function requestQualityPrediction(lineId) {
  try {
    const response = await apiClient.post("/predictions/request", {
      productionLineId: lineId,
      type: "quality",
      parameters: {
        timeHorizon: "24h",
        confidenceThreshold: 0.85,
        includeFactors: true,
      },
    });

    const predictionId = response.data.data.predictionId;
    console.log(`Prediction requested: ${predictionId}`);

    // Poll for result
    return await waitForPredictionResult(predictionId);
  } catch (error) {
    console.error("Failed to request prediction:", error.response?.data?.error);
    throw error;
  }
}

async function waitForPredictionResult(predictionId, pollInterval = 5000) {
  console.log("Waiting for prediction result...");

  while (true) {
    try {
      const response = await apiClient.get(
        `/predictions/${predictionId}/result`,
      );
      const prediction = response.data.data.prediction;

      if (prediction.status === "completed") {
        console.log("Prediction completed");
        return prediction.result;
      } else if (prediction.status === "failed") {
        throw new Error("Prediction failed");
      }

      // Still processing, wait and retry
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      if (error.response?.status === 404) {
        // Result not ready yet
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        continue;
      }
      throw error;
    }
  }
}

// Usage
const predictionResult = await requestQualityPrediction("line_123");
console.log("Prediction result:", predictionResult);
```

### Batch Prediction Analysis (Python)

```python
def analyze_multiple_predictions(factory_id: str, prediction_type: str = "maintenance"):
    """Analyze predictions across all production lines in a factory"""
    import asyncio
    from concurrent.futures import ThreadPoolExecutor

    # Get all production lines
    response = client.get(f"/factories/{factory_id}/production-lines")
    production_lines = response["data"]["productionLines"]

    print(f"Analyzing {len(production_lines)} production lines...")

    def get_line_predictions(line):
        """Get predictions for a single production line"""
        try:
            params = {
                "lineId": line["id"],
                "type": prediction_type,
                "limit": 10
            }

            response = client.get("/predictions", params=params)
            predictions = response["data"]["predictions"]

            # Calculate risk score
            if predictions:
                avg_probability = sum(p["probability"] for p in predictions) / len(predictions)
                high_risk = sum(1 for p in predictions if p["probability"] > 0.7)
            else:
                avg_probability = 0
                high_risk = 0

            return {
                "line_name": line["name"],
                "line_id": line["id"],
                "predictions_count": len(predictions),
                "avg_probability": avg_probability,
                "high_risk_count": high_risk,
                "status": "high_risk" if high_risk > 0 else "normal"
            }
        except Exception as e:
            print(f"Error analyzing line {line['name']}: {e}")
            return None

    # Use ThreadPoolExecutor for parallel requests
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(get_line_predictions, production_lines))

    # Filter out None results and sort by risk
    valid_results = [r for r in results if r is not None]
    valid_results.sort(key=lambda x: x["avg_probability"], reverse=True)

    # Generate report
    print("\n=== Prediction Analysis Report ===")
    print(f"Factory: {factory_id}")
    print(f"Prediction Type: {prediction_type}")
    print(f"Total Lines Analyzed: {len(valid_results)}")
    print("\nRisk Assessment:")

    high_risk_lines = [r for r in valid_results if r["status"] == "high_risk"]
    if high_risk_lines:
        print(f"  High Risk Lines: {len(high_risk_lines)}")
        for line in high_risk_lines[:3]:  # Show top 3
            print(f"    - {line['line_name']}: {line['avg_probability']:.1%} avg probability")
    else:
        print("  No high-risk lines detected")

    # Calculate overall statistics
    total_predictions = sum(r["predictions_count"] for r in valid_results)
    overall_avg_prob = sum(r["avg_probability"] for r in valid_results) / len(valid_results)

    print(f"\nOverall Statistics:")
    print(f"  Total Predictions: {total_predictions}")
    print(f"  Average Probability: {overall_avg_prob:.1%}")

    return valid_results

# Usage
results = analyze_multiple_predictions("factory_123", "maintenance")
```

## Real-time Monitoring Examples

### WebSocket Client (JavaScript)

```javascript
class SentientFactoryWebSocket {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscriptions = new Set();
    this.messageHandlers = new Map();
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket("wss://api.sentientfactory.com/v1/ws");

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;

        // Authenticate
        this.send({
          type: "auth",
          token,
        });

        // Resubscribe to previous subscriptions
        this.subscriptions.forEach((channel) => {
          this.subscribe(channel);
        });

        resolve();
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.attemptReconnect();
      };
    });
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected");
    }
  }

  subscribe(channel, params = {}) {
    const subscription = { channel, ...params };
    this.subscriptions.add(JSON.stringify(subscription));

    this.send({
      type: "subscribe",
      ...subscription,
    });
  }

  unsubscribe(channel, params = {}) {
    const subscription = { channel, ...params };
    this.subscriptions.delete(JSON.stringify(subscription));

    this.send({
      type: "unsubscribe",
      ...subscription,
    });
  }

  on(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType).push(handler);
  }

  handleMessage(message) {
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach((handler) => handler(message));
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );

      setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.connect(localStorage.getItem("token"));
        }
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Usage
const wsClient = new SentientFactoryWebSocket();

// Connect with token
await wsClient.connect(authToken);

// Subscribe to factory updates
wsClient.subscribe("factory_updates", {
  factoryId: "factory_123",
});

// Subscribe to alerts
wsClient.subscribe("alerts", {
  factoryId: "factory_123",
  severity: "critical",
});

// Handle messages
wsClient.on("factory_update", (message) => {
  console.log("Factory update:", message.data);
  updateDashboard(message.data);
});

wsClient.on("alert", (message) => {
  console.log("New alert:", message.alert);
  showAlertNotification(message.alert);
});

wsClient.on("sensor_data", (message) => {
  console.log("Sensor data:", message.data);
  updateSensorChart(message.data);
});
```

### Real-time Dashboard (Python with asyncio)

```python
import asyncio
import websockets
import json
from typing import Dict, Any, Callable
import threading

class AsyncWebSocketClient:
    def __init__(self, token: str):
        self.token = token
        self.websocket = None
        self.subscriptions = set()
        self.handlers: Dict[str, Callable] = {}
        self.running = False

    async def connect(self):
        """Connect to WebSocket server"""
        uri = "wss://api.sentientfactory.com/v1/ws"

        try:
            self.websocket = await websockets.connect(uri)
            print("WebSocket connected")

            # Authenticate
            await self.send({
                "type": "auth",
                "token": self.token
            })

            # Start listening
            self.running = True
            asyncio.create_task(self.listen())

        except Exception as e:
            print(f"Connection failed: {e}")
            await self.reconnect()

    async def send(self, message: Dict[str, Any]):
        """Send message to server"""
        if self.websocket:
            await self.websocket.send(json.dumps(message))

    async def subscribe(self, channel: str, **params):
        """Subscribe to a channel"""
        subscription = {"channel": channel, **params}
        self.subscriptions.add(json.dumps(subscription, sort_keys=True))

        await self.send({
            "type": "subscribe",
            **subscription
        })

    async def listen(self):
        """Listen for incoming messages"""
        try:
            async for message in self.websocket:
                data = json.loads(message)
                await self.handle_message(data)

        except websockets.exceptions.ConnectionClosed:
            print("WebSocket connection closed")
            if self.running:
                await self.reconnect()

    async def handle_message(self, message: Dict[str, Any]):
        """Handle incoming message"""
        message_type = message.get("type")

        if message_type in self.handlers:
            await self.handlers[message_type](message)
        else:
            print(f"Unhandled message type: {message_type}")

    def on(self, message_type: str, handler: Callable):
        """Register message handler"""
        self.handlers[message_type] = handler

    async def reconnect(self):
        """Attempt to reconnect"""
        print("Attempting to reconnect...")
        await asyncio.sleep(5)  # Wait before reconnecting
        await self.connect()

    async def disconnect(self):
        """Disconnect from server"""
        self.running = False
        if self.websocket:
            await self.websocket.close()

# Usage example
async def main():
    # Initialize client
    client = AsyncWebSocketClient(token="your_jwt_token")

    # Define handlers
    async def handle_factory_update(message):
        data = message.get("data", {})
        print(f"Factory update: {data.get('metric')} = {data.get('value')}")

    async def handle_alert(message):
        alert = message.get("alert", {})
        print(f"ALERT: {alert.get('title')} - {alert.get('severity')}")

    # Register handlers
    client.on("factory_update", handle_factory_update)
    client.on("alert", handle_alert)

    # Connect and subscribe
    await client.connect()
    await client.subscribe("factory_updates", factoryId="factory_123")
    await client.subscribe("alerts", factoryId="factory_123")

    # Keep running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")
        await client.disconnect()

# Run in background thread
def run_websocket_client():
    asyncio.run(main())

# Start WebSocket client in background
threading.Thread(target=run_websocket_client, daemon=True).start()
```

## Error Handling Examples

### Comprehensive Error Handling (JavaScript)

```javascript
class APIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toString() {
    return `APIError [${this.code}]: ${this.message}`;
  }
}

class SentientFactoryAPI {
  constructor(baseURL, token = null) {
    this.baseURL = baseURL;
    this.token = token;
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryableStatuses: [429, 500, 502, 503, 504],
    };
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      ...options,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    let lastError;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Check if we should retry
          if (
            this.retryConfig.retryableStatuses.includes(response.status) &&
            attempt < this.retryConfig.maxRetries
          ) {
            const delay = this.retryConfig.retryDelay * Math.pow(2, attempt);
            console.warn(
              `Request failed (${response.status}), retrying in ${delay}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw new APIError(
            errorData.error?.message || `HTTP ${response.status}`,
            errorData.error?.code || `HTTP_${response.status}`,
            errorData.error?.details,
          );
        }

        const responseData = await response.json();
        return responseData.data;
      } catch (error) {
        lastError = error;

        // Don't retry on network errors after first attempt
        if (error instanceof TypeError && attempt > 0) {
          break;
        }
      }
    }

    throw lastError;
  }

  async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request("POST", endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request("PUT", endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options);
  }

  setToken(token) {
    this.token = token;
  }
}

// Usage with error handling
const api = new SentientFactoryAPI("https://api.sentientfactory.com/v1");
api.setToken("your_jwt_token");

try {
  const factories = await api.get("/factories", {
    params: { status: "active", limit: 10 },
  });
  console.log("Factories:", factories);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error (${error.code}):`, error.message);

    switch (error.code) {
      case "AUTH_ERROR":
        console.log("Please login again");
        break;
      case "RATE_LIMITED":
        console.log("Rate limit exceeded, please wait");
        break;
      case "VALIDATION_ERROR":
        console.log("Validation errors:", error.details);
        break;
      default:
        console.log("Unknown error, please try again later");
    }
  } else {
    console.error("Network error:", error.message);
  }
}
```

## Testing Examples

### API Test Suite (Python with pytest)

```python
import pytest
import requests
from datetime import datetime, timedelta

@pytest.fixture
def api_client():
    """Create authenticated API client for testing"""
    client = SentientFactoryClient()

    # Use test credentials
    client.login(
        email="test@example.com",
        password="testpassword123"
    )

    yield client

    # Cleanup after tests
    client.session.close()

@pytest.fixture
def test_factory(api_client):
    """Create a test factory and clean up after tests"""
    factory_data = {
        "name": f"Test Factory {datetime.now().timestamp()}",
        "location": "Test Location",
        "type": "testing",
        "capacity": 100
    }

    response = api_client.post("/factories", json=factory_data)
    factory_id = response["data"]["factory"]["id"]

    yield factory_id

    # Cleanup
    try:
        api_client.delete(f"/factories/{factory_id}")
    except:
        pass  # Factory might already be deleted

class TestFactoryAPI:
    def test_create_factory(self, api_client):
        """Test factory creation"""
        factory_data = {
            "name": "New Test Factory",
            "location": "Test City",
            "type": "manufacturing",
            "capacity": 500
        }

        response = api_client.post("/factories", json=factory_data)

        assert response["success"] == True
        assert "factory" in response["data"]
        assert response["data"]["factory"]["name"] == factory_data["name"]
        assert response["data"]["factory"]["type"] == factory_data["type"]

        # Cleanup
        factory_id = response["data"]["factory"]["id"]
        api_client.delete(f"/factories/{factory_id}")

    def test_list_factories(self, api_client, test_factory):
        """Test listing factories"""
        response = api_client.get("/factories")

        assert response["success"] == True
        assert "factories" in response["data"]
        assert "pagination" in response["data"]

        # Should find our test factory
        factory_ids = [f["id"] for f in response["data"]["factories"]]
        assert test_factory in factory_ids

    def test_get_factory(self, api_client, test_factory):
        """Test getting factory details"""
        response = api_client.get(f"/factories/{test_factory}")

        assert response["success"] == True
        assert "factory" in response["data"]
        assert response["data"]["factory"]["id"] == test_factory

    def test_update_factory(self, api_client, test_factory):
        """Test updating factory"""
        update_data = {
            "name": "Updated Test Factory",
            "capacity": 750
        }

        response = api_client.put(
            f"/factories/{test_factory}",
            json=update_data
        )

        assert response["success"] == True
        assert response["data"]["factory"]["name"] == update_data["name"]
        assert response["data"]["factory"]["capacity"] == update_data["capacity"]

    def test_delete_factory(self, api_client):
        """Test factory deletion"""
        # Create factory to delete
        factory_data = {
            "name": "Factory to Delete",
            "location": "Test",
            "type": "testing",
            "capacity": 100
        }

        create_response = api_client.post("/factories", json=factory_data)
        factory_id = create_response["data"]["factory"]["id"]

        # Delete factory
        delete_response = api_client.delete(f"/factories/{factory_id}")

        assert delete_response["success"] == True

        # Verify factory is deleted
        with pytest.raises(requests.exceptions.HTTPError) as exc_info:
            api_client.get(f"/factories/{factory_id}")

        assert exc_info.value.response.status_code == 404

class TestSensorAPI:
    def test_ingest_sensor_data(self, api_client, test_factory):
        """Test sensor data ingestion"""
        # First create a production line
        line_data = {
            "name": "Test Line",
            "type": "testing",
            "capacity": 50
        }

        line_response = api_client.post(
            f"/factories/{test_factory}/production-lines",
            json=line_data
        )
        line_id = line_response["data"]["productionLine"]["id"]

        # Create a sensor
        sensor_data = {
            "name": "Test Sensor",
            "type": "temperature",
            "sensorId": f"TEST-{datetime.now().timestamp()}",
            "location": "Test Zone"
        }

        sensor_response = api_client.post(
            f"/production-lines/{line_id}/sensors",
            json=sensor_data
        )
        sensor_id = sensor_response["data"]["sensor"]["sensorId"]

        # Ingest sensor data
        ingest_data = {
            "sensorId": sensor_id,
            "readings": [
                {
                    "timestamp": datetime.now().isoformat() + "Z",
                    "value": 25.5,
                    "quality": 0.95
                }
            ]
        }

        ingest_response = api_client.post("/sensors/data", json=ingest_data)

        assert ingest_response["success"] == True
        assert ingest_response["data"]["ingested"] == 1

        # Cleanup
        api_client.delete(f"/production-lines/{line_id}")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```
