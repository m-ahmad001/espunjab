-- Create statistics table to store metric counts
CREATE TABLE IF NOT EXISTS statistics (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(255) UNIQUE NOT NULL,
    metric_value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on metric_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_statistics_metric_name ON statistics(metric_name);

-- Insert initial record for total_forms
INSERT INTO statistics (metric_name, metric_value, updated_at)
VALUES ('total_forms', 0, CURRENT_TIMESTAMP)
ON CONFLICT (metric_name) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE statistics IS 'Stores various application metrics and statistics';
