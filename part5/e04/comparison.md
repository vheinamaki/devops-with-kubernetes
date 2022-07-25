# Exercise 5.04: Platform comparison

For this exercise I chose to argue for Red Hat OpenShift against Google Anthos. Both of them seem to be high-end Kubernetes distributions which can be run either on various cloud platforms or on-premises.

- OpenShift is focused on a more streamlined developer experience, it includes utilities such as [oc and odo](https://docs.openshift.com/container-platform/4.10/cli_reference/) to help working with Kubernetes and containers. The tools provided by Anthos, such as [Kf](https://cloud.google.com/migrate/kf/docs/2.9), are more focused on integrations with other Google Cloud products and thus are not as flexible.

- OpenShift comes with purpose-built CI/CD solutions, which are well integrated with Kubernetes. Anthos also supports CI/CD solutions, but it doesn't have a dedicated "default" choice.

- OpenShift supports sandboxed containers based on Kata Containers, which allow untrusted workloads to run in a light-weight VM. At least I could not find any similar feature in Anthos.

- OpenShift supports more cloud platforms than Anthos: both support AWS, Azure and Google Cloud, but OpenShift also supports IBM Cloud. Additionally Anthos clusters must always be managed through Google Cloud Services, while OpenShift allows to use the cloud provider's own platform.

- Receiving good customer support should be easier since most of the OpenShift stack has been developed in-house by Red Hat, from the underlying operating system to the high-level management tools. Since Anthos is less opinionated, it needs to be supplemented with more third-party software.
