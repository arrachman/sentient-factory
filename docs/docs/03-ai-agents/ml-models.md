# Machine Learning Models

## Overview

Sentient Factory employs various ML models for different aspects of intelligent manufacturing:

## Model Categories

### 1. Predictive Maintenance Models

**Purpose**: Predict equipment failures before they occur

**Models**:

- **LSTM Networks**: For time-series prediction of sensor data
- **Random Forest**: For classification of failure patterns
- **XGBoost**: For feature importance analysis

**Features**:

- Vibration sensor readings
- Temperature fluctuations
- Pressure variations
- Power consumption patterns

**Output**: Probability of failure within next 24-72 hours

### 2. Quality Control Models

**Purpose**: Detect product defects in real-time

**Models**:

- **CNN (Computer Vision)**: For visual defect detection
- **Autoencoders**: For anomaly detection in production data
- **SVM**: For classification of defect types

**Input Sources**:

- Camera images
- Sensor measurements
- Production parameters

**Output**: Defect classification and confidence scores

### 3. Production Optimization Models

**Purpose**: Optimize production schedules and resource allocation

**Models**:

- **Reinforcement Learning**: For dynamic scheduling
- **Genetic Algorithms**: For parameter optimization
- **Linear Regression**: For yield prediction

**Optimization Targets**:

- Production throughput
- Energy consumption
- Material usage
- Labor efficiency

### 4. Supply Chain Models

**Purpose**: Predict demand and optimize inventory

**Models**:

- **Time Series Forecasting**: For demand prediction
- **Clustering Algorithms**: For customer segmentation
- **Neural Networks**: For price optimization

## Model Training Pipeline

### Data Collection

```python
# Example data collection pipeline
class DataCollector:
    def __init__(self):
        self.sensor_client = SensorClient()
        self.db_client = DatabaseClient()

    def collect_training_data(self, start_date, end_date):
        # Collect sensor data
        sensor_data = self.sensor_client.get_historical_data(
            start_date, end_date
        )

        # Collect maintenance records
        maintenance_data = self.db_client.get_maintenance_records(
            start_date, end_date
        )

        # Merge and preprocess
        return self.preprocess_data(sensor_data, maintenance_data)
```

### Feature Engineering

```python
# Feature engineering example
def create_features(raw_data):
    features = {}

    # Time-based features
    features['hour_of_day'] = raw_data['timestamp'].hour
    features['day_of_week'] = raw_data['timestamp'].dayofweek
    features['is_weekend'] = features['day_of_week'] >= 5

    # Statistical features
    features['mean_temp'] = raw_data['temperature'].rolling(24).mean()
    features['std_vibration'] = raw_data['vibration'].rolling(12).std()
    features['max_pressure'] = raw_data['pressure'].rolling(6).max()

    # Lag features
    features['temp_lag_1'] = raw_data['temperature'].shift(1)
    features['vibration_lag_3'] = raw_data['vibration'].shift(3)

    return features
```

### Model Training

```python
# Example training script
def train_predictive_maintenance_model(X_train, y_train):
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import GridSearchCV

    # Define model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )

    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [5, 10, 15],
        'min_samples_split': [2, 5, 10]
    }

    grid_search = GridSearchCV(
        model, param_grid, cv=5, scoring='f1'
    )
    grid_search.fit(X_train, y_train)

    return grid_search.best_estimator_
```

## Model Deployment

### Real-time Inference

```python
# Inference service
class InferenceService:
    def __init__(self, model_path):
        self.model = load_model(model_path)
        self.scaler = load_scaler('scaler.pkl')

    def predict(self, sensor_data):
        # Preprocess input
        features = self.preprocess(sensor_data)
        scaled_features = self.scaler.transform(features)

        # Make prediction
        prediction = self.model.predict(scaled_features)
        probability = self.model.predict_proba(scaled_features)

        return {
            'prediction': prediction[0],
            'probability': probability[0][1],
            'timestamp': datetime.now()
        }
```

### Model Monitoring

```python
# Model monitoring
class ModelMonitor:
    def __init__(self):
        self.metrics = {}

    def track_performance(self, predictions, actuals):
        from sklearn.metrics import accuracy_score, precision_score, recall_score

        self.metrics['accuracy'] = accuracy_score(actuals, predictions)
        self.metrics['precision'] = precision_score(actuals, predictions)
        self.metrics['recall'] = recall_score(actuals, predictions)

        # Log to monitoring system
        self.log_metrics(self.metrics)

        # Check for drift
        if self.detect_drift():
            self.trigger_retraining()
```

## Performance Metrics

### Predictive Maintenance

- Precision: > 0.85
- Recall: > 0.80
- F1-Score: > 0.82
- False Positive Rate: < 0.10

### Quality Control

- Accuracy: > 0.95
- Defect Detection Rate: > 0.90
- False Rejection Rate: < 0.05

### Production Optimization

- Throughput Improvement: > 15%
- Energy Savings: > 10%
- Waste Reduction: > 20%

## Retraining Strategy

### Scheduled Retraining

- Weekly: For high-frequency models
- Monthly: For stable models
- Quarterly: Comprehensive model review

### Trigger-based Retraining

- Performance degradation (> 5% drop)
- Data drift detection
- New equipment installation
- Process changes
