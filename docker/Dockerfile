FROM mongo:latest

# GHCR labels
ARG SOURCE_REPO="https://github.com/Sage-Bionetworks/agora"
ARG DESCRIPTION=""

# Paths on local machine - may be overwritten at build time
ARG LOCAL_DATA_PATH="./local/data" 
ARG LOCAL_COLLECTIONS_PATH="./scripts/collections.csv"
ARG LOCAL_IMPORT_SCRIPT_PATH="./docker/import-data.sh"
ARG LOCAL_CREATE_INDEXES_PATH="./scripts/mongo-create-Indexes.js"

# Paths within the image
ENV DATA_DIR="input_data"
ENV TEAM_IMAGES_DIR="${DATA_DIR}/team_images"
ENV COLLECTIONS_FILE="collections.csv"
ENV IMPORT_DATA_FILE="import-data.sh"
ENV CREATE_INDEXES_FILE="create-indexes.js"

# Copy data and scripts to image
COPY "${LOCAL_DATA_PATH}" "${DATA_DIR}"
COPY "${LOCAL_COLLECTIONS_PATH}" "${COLLECTIONS_FILE}"
COPY "${LOCAL_IMPORT_SCRIPT_PATH}" "${IMPORT_DATA_FILE}"
COPY "${LOCAL_CREATE_INDEXES_PATH}" "${CREATE_INDEXES_FILE}"

# Make scripts executable
RUN chmod +x "${IMPORT_DATA_FILE}"
RUN chmod +x "${CREATE_INDEXES_FILE}"

# Add GHCR labels
LABEL org.opencontainers.image.source="${SOURCE_REPO}"
LABEL org.opencontainers.image.description="${DESCRIPTION}"

# On container startup, import data into mongodb
CMD ["/bin/bash", "import-data.sh"]