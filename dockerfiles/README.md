# How to build Docker images?

|  Docker   | Versions      |
|---------- |:-------------:|
| Version   | 4.1.1         |
| Engine    | 20.10.8       |
| compose   | 1.29.2        |


# Build (locally)

### Build and run Frontend docker container
```sh
docker build --tag gcr.io/<PROJECT_ID>/pangea-frontend:latest --file dockerfiles/Dockerfile__Frontend .
docker run gcr.io/<PROJECT_ID>/pangea-frontend:latest
```

### Examples with PROJECT_ID=development
```sh
docker build --target deps --tag gcr.io/development/pangea-frontend-deps:latest --file dockerfiles/Dockerfile__Frontend .
docker build --target builder --tag gcr.io/development/pangea-frontend-builder:latest --file dockerfiles/Dockerfile__Frontend .
docker build --tag gcr.io/development/pangea-frontend:latest --file dockerfiles/Dockerfile__Frontend .

docker run --net=host gcr.io/development/pangea-frontend:latest

docker push gcr.io/development/pangea-frontend-deps:latest
docker push gcr.io/development/pangea-frontend-builder:latest
docker push gcr.io/development/pangea-frontend:latest
```

# Google Cloud Build

## How to login gcloud on local terminal?
```sh
gcloud auth login
```

## How to submit a build to Google Cloud Build?
```sh
PROJECT_ID=<PROJECT_ID> gcloud builds submit --timeout=0h10m0s .
```

### Example
```sh
PROJECT_ID=development gcloud builds submit --timeout=0h10m0s .
```
