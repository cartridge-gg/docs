---
description: Scale your slot deployments by upgrading to paid instances.
title: Scale your deployments
---

# Scale your deployments

Slot instances are launched with the `basic` instance by default. This instance type is only suitable for testing and
development purposes and comes with limited CPU & memory. 3 deployments of the basic tier are free.

To prepare your deployments for production, you can set up billing and upgrade to a paid instance tier.

## Instances

| Tier      | Description                       | Storage | Cost       |
|-----------|-----------------------------------|---------|------------|
| Basic     | First 3 are free. for dev & tests | 1GB     | $10/month  |
| Pro       | 2 vCPU and 4GB RAM                | auto    | $50/month  |
| Epic      | 4 vCPU and 8GB RAM                | auto    | $100/month |
| Legendary | 8 vCPU and 16GB RAM               | auto    | $200/month |

Note: basic instances are scaled down automatically after a few hours of no activity. To revive deployments, simply send a single request to the instance URL, and it'll be revived on the spot. If unused without any activity for more than 30 days, it will get deleted.

### Premium tiers

Pro and higher tiers are never scaled down or deleted as long as there are enough credits on the related team.
They also come with auto storage scaling, which means your deployment can never run out of disk space.

Storage is billed at $0.20/GB/month.

## Replicas

For torii, with premium tiers, you can choose to deploy your instances with multiple replicas using the `--replicas <n>` flag.

```shell
slot d create --tier epic my-project torii --replicas 3
```

Replicas are billed as how many replicas you have. For example, if you have 3 replicas, you will be billed 3 times the monthly cost of the tier you are using.

## Regions

The default for all regions is us-east, but you can choose to deploy your instances in a different or even multiple regions.

| Region            |
|-------------------|
| `us-east`         |
| `europe-west`     |

To deploy a slot service in multiple regions, you can use the `--regions` flag.

```shell
# torii supports multiple versions - billed per replica per region
slot d create --tier pro my-project torii --regions us-east,europe-west
# or
slot d create --tier pro my-project katana --regions europe-west
```

Katana can be only launched in a single region, while torii uses replicas and routes global users to the nearest one.

Multi-region deployments are billed based on the number of regions you choose and the tier you are using by multiplying the monthly cost of the tier by the number of regions times replicas. For example, if you have two replicas in three regions, you will be billed six times the monthly cost of the tier you are using.

## Billing

Before creating paid tier deployments, you need to set up billing for your team. See the [Billing](/slot/billing) documentation for detailed information on creating teams, funding, and managing credits.

## Create an instance with a paid tier

Make sure to use the team flag of the team you previously transferred credits to.

```shell
slot d create --tier epic --team my-team my-instance torii
```

## Update an existing instance to a paid tier

Note that you can only upgrade tiers; downgrading to a lower tier is not possible.

Make sure that you created this instance with the team flag of the team you previously transferred credits to, or make sure the team it belongs to has credits available.

```shell
slot d update --tier epic my-instance torii
```
