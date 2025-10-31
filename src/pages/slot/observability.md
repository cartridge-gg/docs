---
description: Monitor your Slot deployments with integrated Prometheus metrics and Grafana dashboards.
title: Slot Observability
---

# Observability

Slot provides built-in observability features for your deployments, enabling you to monitor performance metrics and visualize system behavior through integrated Prometheus and Grafana instances.

## Overview

The `--observability` flag enables monitoring capabilities for both Katana and Torii deployments. When enabled, Slot provisions:

- A dedicated Prometheus instance to scrape and store metrics
- A Grafana dashboard for visualization and analysis
- Secure access via username/password authentication

**Cost**: $10/month flat rate per deployment with observability enabled.

## Enabling Observability

### On Deployment Creation

Enable observability when creating a new deployment:

```sh
# For Katana
slot deployments create <Project Name> katana --observability

# For Torii
slot deployments create <Project Name> torii --observability --world 0x3fa481f41522b90b3684ecfab7650c259a76387fab9c380b7a959e3d4ac69f
```

### On Deployment Update

Add observability to an existing deployment:

```sh
# For Katana
slot deployments update <Project Name> katana --observability

# For Torii
slot deployments update <Project Name> torii --observability
```

## Accessing Dashboards

Once observability is enabled, you can access the monitoring interfaces at the following paths on your deployment URL:

### Prometheus
```
https://<your-deployment-url>/prometheus
```

Access raw metrics, query using PromQL, and explore time-series data.

### Grafana
```
https://<your-deployment-url>/grafana
```

:::info
Both Prometheus and Grafana are protected by username/password authentication. Credentials are provided when you enable observability on your deployment.
:::

## Features

- **Performance Monitoring**: Track request rates, response times, and throughput
- **Resource Utilization**: Monitor CPU, memory, and network usage
- **Debugging**: Correlate metrics with application behavior during issues
- **Capacity Planning**: Analyze trends to plan for scaling needs
- **Alerting**: Set up alerts based on metric thresholds (via Grafana)

## Examples

Enable observability for a production Katana instance:
```sh
slot deployments create my-game katana --observability
```

Add observability to an existing Torii deployment:
```sh
slot deployments update my-game torii --observability
```
