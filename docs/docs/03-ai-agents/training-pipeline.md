# Training Pipeline

## Overview

The training pipeline automates the process of training, evaluating, and deploying ML models for Sentient Factory.

## Pipeline Architecture

### Components

#### 1. Data Ingestion

```python
class DataIngestion:
    def __init__(self):
        self.sources = {
            'sensors': SensorDataSource(),
            'maintenance': MaintenanceDataSource(),
            'production': ProductionDataSource()
        }

    def ingest_data(self, start_date, end_date):
        data_frames = {}
        for source_name, source in self.sources.items():
            data_frames[source_name] = source.fetch(
                start_date, end_date
            )
        return data_frames
```

#### 2. Data Validation

```python
class DataValidator:
    def __init__(self):
        self.rules = self.load_validation_rules()

    def validate(self, data):
        validation_results = {}

        # Check for missing values
        missing_check = self.check_missing_values(data)
        validation_results['missing_values'] = missing_check

        # Check data types
        type_check = self.check_data_types(data)
        validation_results['data_types'] = type_check

        # Check value ranges
        range_check = self.check_value_ranges(data)
        validation_results['value_ranges'] = range_check

        return validation_results

    def check_missing_values(self, data):
        missing_percentage = data.isnull().sum() / len(data) * 100
        return missing_percentage[missing_percentage > 5].to_dict()
```

#### 3. Feature Engineering

```python
class FeatureEngineer:
    def __init__(self):
        self.feature_config = self.load_feature_config()

    def engineer_features(self, raw_data):
        features = pd.DataFrame()

        # Time-based features
        if 'timestamp' in raw_data.columns:
            features = self.add_time_features(raw_data, features)

        # Statistical features
        if self.feature_config['statistical_features']:
            features = self.add_statistical_features(raw_data, features)

        # Domain-specific features
        features = self.add_domain_features(raw_data, features)

        return features

    def add_time_features(self, raw_data, features):
        dt_series = pd.to_datetime(raw_data['timestamp'])
        features['hour'] = dt_series.dt.hour
        features['day_of_week'] = dt_series.dt.dayofweek
        features['month'] = dt_series.dt.month
        features['is_weekend'] = features['day_of_week'].isin([5, 6])
        return features
```

#### 4. Model Training

```python
class ModelTrainer:
    def __init__(self, model_type='random_forest'):
        self.model_type = model_type
        self.models = {
            'random_forest': RandomForestClassifier,
            'xgboost': XGBClassifier,
            'lstm': LSTMModel
        }

    def train(self, X_train, y_train, X_val, y_val):
        # Initialize model
        model_class = self.models[self.model_type]
        model = model_class()

        # Hyperparameter tuning
        best_params = self.tune_hyperparameters(
            model, X_train, y_train
        )

        # Train with best parameters
        model.set_params(**best_params)
        model.fit(X_train, y_train)

        # Evaluate
        train_score = model.score(X_train, y_train)
        val_score = model.score(X_val, y_val)

        return model, {
            'train_score': train_score,
            'val_score': val_score,
            'best_params': best_params
        }
```

#### 5. Model Evaluation

```python
class ModelEvaluator:
    def __init__(self):
        self.metrics = [
            'accuracy', 'precision', 'recall', 'f1',
            'roc_auc', 'confusion_matrix'
        ]

    def evaluate(self, model, X_test, y_test):
        results = {}

        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]

        # Calculate metrics
        for metric in self.metrics:
            if metric == 'confusion_matrix':
                results[metric] = confusion_matrix(y_test, y_pred)
            else:
                metric_func = getattr(metrics, metric)
                if metric in ['roc_auc']:
                    results[metric] = metric_func(y_test, y_pred_proba)
                else:
                    results[metric] = metric_func(y_test, y_pred)

        # Generate reports
        results['classification_report'] = classification_report(
            y_test, y_pred, output_dict=True
        )

        return results
```

## Pipeline Configuration

### config.yaml

```yaml
pipeline:
  name: "predictive_maintenance"
  version: "1.0.0"

data:
  sources:
    sensors:
      type: "postgresql"
      table: "sensor_readings"
      date_column: "timestamp"
    maintenance:
      type: "postgresql"
      table: "maintenance_records"

features:
  time_features: true
  statistical_features: true
  lag_features: [1, 3, 6, 12]
  rolling_windows: [6, 12, 24]

model:
  type: "random_forest"
  hyperparameters:
    n_estimators: [50, 100, 200]
    max_depth: [5, 10, 15]
    min_samples_split: [2, 5, 10]

training:
  test_size: 0.2
  validation_size: 0.1
  random_state: 42
  cv_folds: 5

evaluation:
  metrics: ["accuracy", "precision", "recall", "f1", "roc_auc"]
  threshold: 0.5

deployment:
  min_accuracy: 0.85
  min_precision: 0.80
  min_recall: 0.75
```

## Execution Flow

### 1. Pipeline Initialization

```python
def initialize_pipeline(config_path):
    config = load_config(config_path)
    pipeline = TrainingPipeline(config)
    return pipeline
```

### 2. Data Processing

```python
def process_data(pipeline, start_date, end_date):
    # Ingest data
    raw_data = pipeline.ingest_data(start_date, end_date)

    # Validate data
    validation_results = pipeline.validate_data(raw_data)
    if not validation_results['is_valid']:
        raise ValueError("Data validation failed")

    # Engineer features
    features = pipeline.engineer_features(raw_data)

    return features
```

### 3. Model Development

```python
def train_model(pipeline, features, target):
    # Split data
    X_train, X_test, y_train, y_test = pipeline.split_data(
        features, target
    )

    # Train model
    model, training_metrics = pipeline.train_model(
        X_train, y_train
    )

    # Evaluate model
    evaluation_results = pipeline.evaluate_model(
        model, X_test, y_test
    )

    return model, training_metrics, evaluation_results
```

### 4. Model Deployment

```python
def deploy_model(pipeline, model, evaluation_results):
    # Check deployment criteria
    if pipeline.meets_deployment_criteria(evaluation_results):
        # Save model artifacts
        pipeline.save_model_artifacts(model)

        # Update model registry
        pipeline.register_model(model, evaluation_results)

        # Deploy to production
        pipeline.deploy_to_production(model)

        return True
    else:
        pipeline.log_failure(evaluation_results)
        return False
```

## Monitoring and Logging

### Pipeline Metrics

```python
class PipelineMonitor:
    def __init__(self):
        self.metrics_store = MetricsStore()
        self.logger = PipelineLogger()

    def track_pipeline_run(self, run_id, metrics):
        # Store metrics
        self.metrics_store.store(run_id, metrics)

        # Log to monitoring system
        self.logger.log_pipeline_run(run_id, metrics)

        # Send alerts if needed
        if self.should_alert(metrics):
            self.send_alert(run_id, metrics)
```

### Error Handling

```python
class PipelineErrorHandler:
    def __init__(self):
        self.error_types = {
            'data_error': self.handle_data_error,
            'training_error': self.handle_training_error,
            'deployment_error': self.handle_deployment_error
        }

    def handle_error(self, error_type, error_details):
        handler = self.error_types.get(error_type)
        if handler:
            return handler(error_details)
        else:
            return self.handle_unknown_error(error_details)
```

## Scheduling

### Cron Schedule

```yaml
schedules:
  daily_training:
    cron: "0 2 * * *" # 2 AM daily
    pipeline: "predictive_maintenance"
    data_range: "last_30_days"

  weekly_retraining:
    cron: "0 3 * * 0" # 3 AM every Sunday
    pipeline: "quality_control"
    data_range: "last_90_days"

  monthly_evaluation:
    cron: "0 4 1 * *" # 4 AM on 1st of every month
    pipeline: "all_models"
    action: "evaluate"
```

## Version Control

### Model Registry

```python
class ModelRegistry:
    def __init__(self):
        self.db = ModelRegistryDB()

    def register_model(self, model_info):
        version = self.generate_version(model_info['pipeline_name'])
        model_info['version'] = version
        model_info['registered_at'] = datetime.now()

        self.db.insert_model(model_info)
        return version

    def get_latest_model(self, pipeline_name):
        return self.db.get_latest_version(pipeline_name)
```
