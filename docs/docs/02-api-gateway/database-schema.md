# Database Schema

## Overview

Sentient Factory uses PostgreSQL as its primary database with the following core tables:

## Core Tables

### Users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Factories

```sql
CREATE TABLE factories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    owner_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Production Lines

```sql
CREATE TABLE production_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES factories(id),
    name VARCHAR(255) NOT NULL,
    line_type VARCHAR(100),
    capacity_per_hour INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sensors

```sql
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_line_id UUID REFERENCES production_lines(id),
    sensor_type VARCHAR(100) NOT NULL,
    sensor_id VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(500),
    calibration_date DATE,
    last_maintenance DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sensor Readings

```sql
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID REFERENCES sensors(id),
    reading_value DECIMAL(10,4),
    reading_type VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### AI Predictions

```sql
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_line_id UUID REFERENCES production_lines(id),
    prediction_type VARCHAR(100),
    predicted_value DECIMAL(10,4),
    confidence_score DECIMAL(3,2),
    prediction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actual_value DECIMAL(10,4),
    accuracy DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX idx_ai_predictions_production_line_id ON ai_predictions(production_line_id);
CREATE INDEX idx_production_lines_factory_id ON production_lines(factory_id);
```

## Relationships

- One User can own multiple Factories
- One Factory can have multiple Production Lines
- One Production Line can have multiple Sensors
- One Sensor can have multiple Readings
- Production Lines can have multiple AI Predictions
