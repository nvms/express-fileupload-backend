This is a project which serves as a test and a template for future projects.

-  /api/v1/static/: Path to static files.

- (JSON) GET /api/v1/music: Path to request a list of files.
- (JSON) POST /api/v1/music: Path to upload new files (use the namefield 'music').
- (JSON) DELETE /api/v1/music/:musicfile: Path to delete a file, send the name of the file to delete.

- (WEB)  GET /status: Status of the backend.

- ENV BYTERESTRICTOR: Env variable which specifies weigth (IN BYTES) limit for each file to upload.

Docker image: https://cloud.docker.com/repository/docker/xenium/express-file-backend/general
