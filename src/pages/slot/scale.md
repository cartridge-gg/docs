---
description: Scale your slot deployments by upgrading to paid instances.
title: Scale your deployments
---

# Scale your deployments

Slot instances are launched with the `basic` instance by default. This instance type is only suitable for testing and
development purposes and comes with limited CPU & memory. 3 deployments of the basic tier are free.

To prepare your deployments for production, you can set up billing and upgrade to a paid instance tier.

## Instances

| Tier      | Description                       | Storage | Old cost  | Cost from July 1st |
|-----------|-----------------------------------|---------|-----------|--------------------|
| Basic     | First 3 are free. for dev & tests | 1GB     | $3/month  | $10/month          |
| Common    | (removed)                         | auto    | $15/month | –                  |
| Pro       | 2 vCPU and 4GB RAM                | auto    | -         | $50/month          |
| Epic      | 4 vCPU and 8GB RAM                | auto    | $15/month | $100/month         |
| Legendary | 8 vCPU and 16GB RAM               | auto    | $35/month | $200/month         |
| Insane    | (removed)                         | auto    | $50/month | -                  |

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

For torii, with premium tiers, you can choose to deploy your instances in multiple regions.

| Region            |
|-------------------|
| `us-east`         |
| `europe-west`     |
| `asia-southeast`  |

To deploy a slot service in multiple regions, you can use the `--regions` flag.

Katana is only supported in `us-east` at this time.

```shell
slot d create --tier pro my-project torii --regions us-east,asia-southeast,europe-west
```

Multi-region deployments are billed based on the number of regions you choose and the tier you are using by multiplying the monthly cost of the tier by the number of regions times replicas. For example, if you have two replicas in three regions, you will be billed six times the monthly cost of the tier you are using.

## Set up billing

To set up slot billing, you need to buy credits and transfer them to a slot team.

If you have existing deployments, a team of the same name as your account will be created for you, and you can transfer credits to it.

```shell
slot teams my-team create --email my-email@example.com # email is required for billing alerts
slot teams my-team update --email my-email@example.com # if you want to update an existing team's email

slot auth fund # buy credits for your account, this opens the browser

slot auth transfer my-team --usd 10 # transfer $10 from your controller to my-team
# or
slot auth transfer my-team --credits 1000 # transfer 1000 credits ($10) from your controller to my-team
```

Once you create paid slot instances, funds are deducted on a daily basic with a minimum charge of one day. For example, if you create a deployment and delete it after one hour, you will be charged 1/30th of the monthly cost.

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
