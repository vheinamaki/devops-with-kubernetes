# Exercise 4.03: Prometheus

Explanation:
1. The two label matchers filter the result vector to those containing the labels
2. The `count` operator counts the number of elements in the input vector
3. `scalar` function returns a scalar value for the single-element vector

```
scalar(count(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"}))

```
