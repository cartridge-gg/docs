---
description: Scale your slot deployments by upgrading to paid instances.
title: Scale your deployments
---

# Scale your deployments

Slot instances are launched with the `basic` instance by default. This instance type is only suitable for testing and
development purposes and comes with limited CPU & memory. 3 deployments of the basic tier are free.

To prepare your deployments for production, you can set up billing and upgrade to a paid instance tier.

## Paid Instances

| Tier      | Description                                     | Storage | Monthly Cost |
|-----------|-------------------------------------------------|---------|--------------|
| Basic     | First 3 are free. Only for development purposes | 1GB     | $3/month     |
| Common    | Upgraded Storage. Only for development purposes | 10GB    | $5/month     |
| Epic      | Playtesting: Elevated CPU & Memory              | 15GB    | $15/month    |
| Legendary | Production: Heavy CPU & memory                  | 15GB    | $35/month    |
| Insane    | Production: Highest CPU & memory                | 20GB    | $50/month    |

## Set up billing

To set up slot billing, you need to buy credits and transfer them to a slot team.

If you have existing deployments, a team of the same name as your account will be created for you, and you can transfer credits to it.

```shell
slot team my-team create # if you want to create a new team
slot auth fund # buy credits to your account
slot auth transfer my-team 100 # transfer $100 to my-team
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
