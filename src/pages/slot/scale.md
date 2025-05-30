---
description: Scale your slot deployments by upgrading to paid instances.
title: Scale your deployments
---

# Scale your deployments

Slot instances are launched with the `basic` instance by default. This instance type is only suitable for testing and
development purposes and comes with limited CPU & memory. 3 deployments of the basic tier are free.

To prepare your deployments for production, you can set up billing and upgrade to a paid instance tier.

## Instances

| Tier      | Description                                     | Storage | Monthly Cost |
|-----------|-------------------------------------------------|---------|--------------|
| Basic     | First 3 are free. Only for development purposes | 1GB     | $3/month     |
| Common    | Upgraded Storage. Only for development purposes | 10GB    | $5/month     |
| Epic      | Playtesting: Elevated CPU & Memory              | 15GB    | $15/month    |
| Legendary | Production: Heavy CPU & memory                  | 15GB    | $35/month    |
| Insane    | Production: Highest CPU & memory                | 20GB    | $50/month    |

Note: basic & common instances are scaled down automatically after a few hours of no activity. To revive deployments, simply send a single request to the instance URL and it'll be revived on the spot. If unused without any activity for more then 30 days, it will get deleted.

Epic and higher tiers are never scaled down or deleted as long as there are enough credits on the related team.

## Regions

With premium tiers `Epic`, `Legendary` and `Insane`, you can choose to deploy your instances in multiple regions.

| Region            |
|-------------------|
| `us-east`         |
| `europe-west`     |
| `asia-southeast`  |

To deploy a slot service in multiple regions, you can use the `--regions` flag.

```shell
slot d create --tier insane --regions us-east,asia-southeast,europe-west my-project torii
```

The pricing will be calculated based on the number of regions you choose and the tier you are using by multiplying the monthly cost of the tier by the number of regions.

## Set up billing

To set up slot billing, you need to buy credits and transfer them to a slot team.

If you have existing deployments, a team of the same name as your account will be created for you, and you can transfer credits to it.

```shell
slot teams my-team create --email my-email@example.com # if you want to create a new team, email is optional for email alerts
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
