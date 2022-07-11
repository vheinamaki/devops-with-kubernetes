# Todo Project

## Exercise 3.06: DBaaS vs DIY

### Managed Cloud SQL

**Pros:**

- Automatic backups
- Less work to set up, initalization and scaling is automatic
- Independent from cluster, can be used by other services even if cluster is down

**Cons:**

- Limited choice of database systems
- Upkeep costs are higher since backups and maintenance are included in the service


### DIY with Kubernetes

**Pros:**

- Can choose to run any DB you want
- More fine-grained control over DB configuration
- Possibly less latency if nodes are in physical proximity
- Upkeep costs depend on how cluster is managed, but can be made lower since there is
  more control

**Cons:**

- More work to set up and maintain
- Pod containing the DB might be restarted or stopped by kubernetes, which might corrupt
  the data if the DB cannot handle that.
- Backups need to be implemented by yourself, as well as the storage for them

## Exercise 3.07: Commitment

I was initially interested in trying Cloud SQL since I have not used managed DBs before,
but the options for connecting to the instace were quite restricted for security reasons,
none of which seemed ideal:

1. Connecting from whitelisted IP range, which needs to be reconfigured often due to addresses changing.
2. Using auth proxy, which requires installing a separate proxy application to every host you want to
   connect from.
3. Only connecting from within a Virtual Private Cloud, which makes local testing difficult.

Additionally there's a Cloud SQL Connector library, but apparently only for Java and Python.

So I decided to use postgres on the cluster instead, since it seemed to be easier to set up after all.
