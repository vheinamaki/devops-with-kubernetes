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
- Upkeep costs depend on how cluster is managed, but can be made lower since there is more control

**Cons:**

- More work to set up and maintain
- Pod containing the DB might be restarted or stopped by kubernetes, which might corrupt the data if the DB cannot handle that.
- Backups need to be implemented by yourself, as well as the storage for them
