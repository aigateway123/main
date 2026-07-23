# Stage 1: Build
FROM golang:1.22-alpine AS builder
ARG SERVICE_NAME=gateway
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/${SERVICE_NAME}

# Stage 2: Run
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/migrations ./migrations
EXPOSE 8080
CMD ["./server"]
